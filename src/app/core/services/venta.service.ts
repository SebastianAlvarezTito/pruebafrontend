import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  VentaRequest,
  VentaResponse,
  VentaForm,
  DetalleVentaRequest
} from '../models/venta.model';

@Injectable({ providedIn: 'root' })
export class VentaService {

  private readonly apiUrl = `${environment.apiUrl}/api/ventas`;

  // ── Signals de estado ────────────────────────────────────────────────────
  private _ventas   = signal<VentaResponse[]>([]);
  private _cargando = signal(false);
  private _error    = signal<string | null>(null);

  ventas   = this._ventas.asReadonly();
  cargando = this._cargando.asReadonly();
  error    = this._error.asReadonly();

  // ── Métricas calculadas ──────────────────────────────────────────────────
  totalVentas    = computed(() => this._ventas().length);
  ventasActivas  = computed(() => this._ventas().filter(v => v.estado === 'C').length);
  ventasAnuladas = computed(() => this._ventas().filter(v => v.estado === 'A').length);
  totalIngresos  = computed(() =>
    this._ventas()
      .filter(v => v.estado === 'C')
      .reduce((acc, v) => acc + v.total, 0)
  );

  constructor(private http: HttpClient) {}

  // ── CRUD ────────────────────────────────────────────────────────────────

  listar(): Observable<VentaResponse[]> {
    this._cargando.set(true);
    this._error.set(null);
    return this.http.get<VentaResponse[]>(this.apiUrl).pipe(
      tap({
        next: data => {
          this._ventas.set(data);
          this._cargando.set(false);
        },
        error: err => {
          this._error.set(err.message || 'Error de comunicación con el servidor');
          this._cargando.set(false);
        }
      })
    );
  }

  obtenerPorId(id: number): Observable<VentaResponse> {
    return this.http.get<VentaResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Registra una nueva venta.
   * Convierte el VentaForm del frontend al VentaRequest que espera el backend.
   * El backend calcula: subtotal_linea = (cantidad × precioUnitario) − descuento
   * y totalVenta = Σ subtotal_linea
   */
  registrar(form: VentaForm): Observable<VentaResponse> {
    const request: VentaRequest = {
      tipoDocumento:         form.tipoDocumento as string,
      numeroDocumento:       form.numeroDocumento,
      estado:                'C',
      referenciaTransaccion: form.referenciaTransaccion,
      idCliente:             form.idCliente!,
      idAlmacen:             form.idAlmacen!,
      idMetodoPago:          form.idMetodoPago!,
      detalles: form.lineas.map((l): DetalleVentaRequest => ({
        idProducto:     l.idProducto!,
        cantidad:       l.cantidad,
        precioUnitario: l.precioUnitario,
        descuento:      l.descuentoMonto ?? 0
      }))
    };
    return this.http.post<VentaResponse>(this.apiUrl, request).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  anular(id: number): Observable<VentaResponse> {
    return this.http.patch<VentaResponse>(`${this.apiUrl}/${id}/anular`, {}).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  // ── Helper: cálculos frontend ───────────────────────────────────────────

  /**
   * Recalcula los totales del formulario en el frontend.
   * Refleja exactamente la misma lógica del backend:
   *   subtotal_linea = (cantidad × precioUnitario) − descuento
   *   total = Σ subtotal_linea
   */
  calcularTotales(form: VentaForm): VentaForm {
    let subtotalBruto   = 0;
    let totalDescuentos = 0;
    let total           = 0;

    for (const linea of form.lineas) {
      const bruto     = linea.cantidad * linea.precioUnitario;
      const descuento = linea.descuentoMonto ?? 0;
      const subtotal  = bruto - descuento;

      linea.subtotal   = subtotal;
      subtotalBruto   += bruto;
      totalDescuentos += descuento;
      total           += subtotal;
    }

    return { ...form, subtotalBruto, totalDescuentos, total };
  }
}
