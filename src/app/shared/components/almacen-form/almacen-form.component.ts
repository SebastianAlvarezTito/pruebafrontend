import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; // 👈 Añadido RouterLink
import { AlmacenService } from '../../../core/services/almacen.service'; // 👈 Ruta corregida a tu arquitectura
import { Almacen, TIPOS_PRODUCTO } from '../../../core/models/almacen.model'; // 👈 Ruta corregida a tu arquitectura

@Component({
  selector: 'app-almacen-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './almacen-form.component.html',
  styleUrls: ['./almacen-form.component.css'],
})
export class AlmacenFormComponent implements OnInit {

  esEdicion = false;
  guardando = false;
  errorMsg = '';

  nombreError = '';
  telefonoError = '';
  responsableError = '';
  ubigeoError = '';

  tiposProducto = TIPOS_PRODUCTO || ['Vino Tinto', 'Vino Blanco', 'Pisco', 'Espumante', 'Materia Prima'];

  // El objeto almacén mapeado exactamente a los campos de tus ngModel del HTML
  almacen: Almacen = {
    idAlmacen: undefined,
    nombre: '',
    ubicacion: '',
    telefono: '',
    responsable: '',
    codigoAlmacen: 'VB-XXXX',
    tipoProducto: '',
    cantidadBotellas: 0,
    estado: 'Activo',
    ubigeoId: ''
  };

  constructor(
    private almacenService: AlmacenService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.esEdicion = true;
      this.almacenService.obtenerPorId(Number(id)).subscribe({
        next: (data: any) => {
          if (data) {
            // Unificamos el mapeo para que absorba cualquier formato del backend de Spring Boot
            this.almacen = {
              idAlmacen: data.idAlmacen ?? data.id_almacen ?? data.id ?? Number(id),
              nombre: data.nombre ?? '',
              ubicacion: data.ubicacion ?? '',
              telefono: data.telefono ?? '',
              responsable: data.responsable ?? '',
              codigoAlmacen: data.codigoAlmacen ?? data.codigo_almacen ?? 'VB-XXXX',
              tipoProducto: data.tipoProducto ?? data.tipo_producto ?? '',
              cantidadBotellas: data.cantidadBotellas ?? data.cantidad_botellas ?? data.totalBotellas ?? 0,
              estado: data.estado ?? 'Activo',
              ubigeoId: data.ubigeoId ?? data.ubigeo_id ?? ''
            };
          } else {
            this.errorMsg = 'Almacén no encontrado en el sistema.';
          }
        },
        error: (err) => {
          console.error('Error al capturar datos del almacén:', err);
          this.errorMsg = 'Error al cargar los datos del almacén de la base de datos.';
        }
      });
    } else {
      this.almacen.codigoAlmacen = 'VB-XXXX'; 
    }
  }

  onTipoProductoChange(): void {
    // Regla de negocio global: El formato de código se mantiene unificado
    this.almacen.codigoAlmacen = 'VB-XXXX';
  }

  validarNombre(): void {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    this.nombreError = !this.almacen.nombre.trim() 
      ? 'El nombre es requerido' 
      : (!regex.test(this.almacen.nombre) ? 'Solo se permiten letras' : '');
  }

  validarResponsable(): void {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    this.responsableError = !this.almacen.responsable.trim() 
      ? 'El responsable es requerido' 
      : (!regex.test(this.almacen.responsable) ? 'Solo se permiten letras' : '');
  }

  validarTelefono(): void {
    const regex = /^[0-9]{9}$/;
    if (this.almacen.telefono && !regex.test(this.almacen.telefono)) {
      this.telefonoError = 'Debe tener exactamente 9 dígitos';
    } else {
      this.telefonoError = '';
    }
  }

  validarUbigeo(): void {
    const regex = /^[0-9]*$/;
    if (!this.almacen.ubigeoId) {
      this.ubigeoError = 'El Ubigeo es obligatorio.';
    } else if (this.almacen.ubigeoId.length !== 6 || !regex.test(this.almacen.ubigeoId)) {
      this.ubigeoError = 'El Ubigeo debe tener exactamente 6 números dígitos.';
    } else {
      this.ubigeoError = '';
    }
  }

  guardar(): void {
    // Forzamos la ejecución manual de todas las validaciones antes de enviar
    this.validarNombre();
    this.validarResponsable();
    this.validarTelefono();
    this.validarUbigeo();

    if (!this.almacen.nombre.trim() || !this.almacen.ubicacion.trim() || !this.almacen.tipoProducto) {
      this.errorMsg = 'Todos los campos marcados con (*) son obligatorios.';
      return;
    }

    if (this.nombreError || this.responsableError || this.telefonoError || this.ubigeoError) {
      this.errorMsg = 'Por favor, corrija los campos inválidos en rojo antes de guardar.';
      return;
    }

    if (this.almacen.cantidadBotellas < 0) {
      this.errorMsg = 'La cantidad de botellas no puede tomar valores negativos.';
      return;
    }

    this.guardando = true;
    this.errorMsg = '';

    // Si tu servicio requiere idAlmacen o id, lo enviamos dinámicamente
    const idEnvio = this.almacen.idAlmacen || (this.almacen as any).id;

    const operacion = this.esEdicion && idEnvio
      ? this.almacenService.editar(idEnvio, this.almacen)
      : this.almacenService.crear(this.almacen);

    operacion.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/almacenes']);
      },
      error: (err) => {
        console.error('Error crítico al procesar guardado:', err);
        this.guardando = false;
        this.errorMsg = err.error?.message || 'Error de comunicación con el backend al intentar guardar.';
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/almacenes']);
  }
}