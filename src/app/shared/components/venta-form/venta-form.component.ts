import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { VentaService } from '../../../core/services/venta.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { AlmacenService } from '../../../core/services/almacen.service';
import { ProductoService } from '../../../core/services/producto.service';
import { VentaForm, LineaVentaForm } from '../../../core/models/venta.model';
import { Cliente } from '../../../core/models/cliente.model';
import { Almacen } from '../../../core/models/almacen.model';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta-form.component.html',
  styleUrls: ['./venta-form.component.css'],
})
export class VentaFormComponent implements OnInit {
  guardando = false;
  cargandoCat = true; // true mientras cargan los catálogos
  errorMsg: string | null = null;

  form: VentaForm = {
    tipoDocumento: '',
    numeroDocumento: '',
    referenciaTransaccion: '',
    idCliente: null,
    clienteNombre: '',
    idAlmacen: null,
    idMetodoPago: null,
    lineas: [this.nuevaLinea()],
    subtotalBruto: 0,
    totalDescuentos: 0,
    total: 0,
  };

  // ── Catálogos cargados desde la API ────────────────────────────────────────
  clientes: Cliente[] = [];
  almacenes: Almacen[] = [];
  productos: Producto[] = [];

  // ── Catálogo estático (no tiene endpoint propio) ────────────────────────────
  tiposDocumento = [
    { value: 'Ticket', label: 'Ticket', prefijo: 'T' },
    { value: 'Boleta', label: 'Boleta', prefijo: 'B' },
    { value: 'Factura', label: 'Factura', prefijo: 'F' },
  ];

  metodosPago = [
    { id: 1, nombre: 'Efectivo', prefijo: 'CASH' },
    { id: 2, nombre: 'Tarjeta de Crédito/Débito', prefijo: 'VISA' },
    { id: 3, nombre: 'Transferencia Bancaria', prefijo: 'OP' },
    { id: 4, nombre: 'Yape', prefijo: 'YAPE' },
    { id: 5, nombre: 'Plin', prefijo: 'PLIN' },
  ];

  /** Al cambiar tipo de documento → genera número con formato corto y número aleatorio */
  onTipoDocumentoChange(): void {
    const tipo = this.tiposDocumento.find((t) => t.value === this.form.tipoDocumento);
    if (!tipo) {
      this.form.numeroDocumento = '';
      return;
    }
    const numero = String(Math.floor(1000 + Math.random() * 9000));
    this.form.numeroDocumento = `${tipo.prefijo}001-${numero}`;
  }

  /** Al cambiar método de pago → genera referencia con formato corto y número aleatorio */
  onMetodoPagoChange(): void {
    const metodo = this.metodosPago.find((m) => m.id === this.form.idMetodoPago);
    if (!metodo) {
      this.form.referenciaTransaccion = '';
      return;
    }
    const numero = String(Math.floor(100 + Math.random() * 9900)).padStart(3, '0');
    this.form.referenciaTransaccion = `${metodo.prefijo}-${numero}`;
  }

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private almacenService: AlmacenService,
    public productoService: ProductoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Carga en paralelo los tres catálogos dinámicos
    forkJoin({
      clientes: this.clienteService.listar(),
      almacenes: this.almacenService.listar(),
    }).subscribe({
      next: ({ clientes, almacenes }) => {
        // Solo clientes activos en el selector
        this.clientes = clientes.filter((c) => c.estado === true);

        // Normalizar almacenes: el backend puede devolver id_almacen o idAlmacen
        // y el estado puede ser string ('Activo','A') o boolean
        this.almacenes = (almacenes as any[])
          .map((item) => ({
            ...item,
            idAlmacen: item.idAlmacen ?? item.id_almacen,
            nombre: item.nombre ?? '',
            estado: item.estado ?? 'Activo',
          }))
          .filter(
            (a) =>
              a.estado === true ||
              a.estado === 'A' ||
              (typeof a.estado === 'string' && a.estado.toLowerCase().includes('activ')),
          );

        this.cargandoCat = false;
      },
      error: (err) => {
        console.error('Error cargando catálogos:', err);
        this.errorMsg = 'Error al cargar los catálogos. Verifique la conexión con el servidor.';
        this.cargandoCat = false;
      },
    });

    // Productos usa cargarTodos() (void) — lo llamamos aparte
    this.productoService.cargarTodos();
    // Suscribimos la señal de productos reactiva
    // (se actualiza automáticamente cuando cargarTodos() termina)
  }

  /** Acceso reactivo a la señal de productos del servicio */
  get productosActivos(): Producto[] {
    return this.productoService.productos().filter((p) => p.estado === true);
  }

  // ── Gestión de líneas ──────────────────────────────────────────────────────

  nuevaLinea(): LineaVentaForm {
    return {
      idProducto: null,
      productoNombre: '',
      cantidad: 1,
      precioUnitario: 0,
      descuentoMonto: 0,
      subtotal: 0,
    };
  }

  agregarLinea(): void {
    this.form.lineas = [...this.form.lineas, this.nuevaLinea()];
  }

  eliminarLinea(index: number): void {
    if (this.form.lineas.length > 1) {
      this.form.lineas = this.form.lineas.filter((_, i) => i !== index);
      this.recalcular();
    }
  }

  /** Al seleccionar producto → auto-rellena el precio unitario desde la BD */
  onProductoChange(index: number): void {
    const linea = this.form.lineas[index];
    const producto = this.productosActivos.find((p) => p.idProducto === linea.idProducto);
    if (producto) {
      linea.productoNombre = producto.nombre;
      linea.precioUnitario = producto.precioUnitario;
    }
    this.recalcular();
  }

  onLineaChange(): void {
    this.recalcular();
  }

  /**
   * Lógica idéntica al backend:
   *   subtotal = (cantidad × precioUnitario) − descuentoMonto
   *   total    = Σ subtotales
   */
  recalcular(): void {
    this.form = this.ventaService.calcularTotales(this.form);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Nombre completo del cliente para mostrar en el select */
  nombreCliente(c: Cliente): string {
    return `${c.nombre} ${c.apellido}`.trim();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value ?? 0);
  }

  // ── Acciones ───────────────────────────────────────────────────────────────

  cancelar(): void {
    this.router.navigate(['/ventas']);
  }

  guardar(): void {
    this.errorMsg = null;

    if (!this.form.tipoDocumento) {
      this.errorMsg = 'Seleccione el tipo de documento.';
      return;
    }
    if (!this.form.numeroDocumento.trim()) {
      this.errorMsg = 'Ingrese el número de documento.';
      return;
    }
    if (!this.form.referenciaTransaccion.trim()) {
      this.errorMsg = 'Ingrese la referencia de transacción (ej. VISA-4433).';
      return;
    }
    if (!this.form.idCliente) {
      this.errorMsg = 'Seleccione un cliente.';
      return;
    }
    if (!this.form.idAlmacen) {
      this.errorMsg = 'Seleccione el almacén de origen.';
      return;
    }
    if (!this.form.idMetodoPago) {
      this.errorMsg = 'Seleccione el método de pago.';
      return;
    }
    if (this.form.lineas.some((l) => !l.idProducto || l.cantidad < 1 || l.precioUnitario <= 0)) {
      this.errorMsg = 'Complete todos los campos de los productos.';
      return;
    }
    if (this.form.lineas.some((l) => l.descuentoMonto < 0)) {
      this.errorMsg = 'El descuento no puede ser negativo.';
      return;
    }
    if (this.form.lineas.some((l) => l.descuentoMonto >= l.cantidad * l.precioUnitario)) {
      this.errorMsg = 'El descuento no puede ser mayor o igual al subtotal de la línea.';
      return;
    }

    this.guardando = true;

    this.ventaService.registrar(this.form).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/ventas']);
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = err?.error?.error || 'Ocurrió un error al registrar la venta.';
      },
    });
  }
}
