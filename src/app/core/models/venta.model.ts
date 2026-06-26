// ── Tipos ──────────────────────────────────────────────────────────────────

export type TipoDocumentoVenta = 'boleta' | 'factura';
export type EstadoVenta = 'C' | 'A'; // C = Confirmado, A = Anulado

// ── DTOs que el backend espera (POST /api/ventas) ──────────────────────────

/** Detalle de una línea enviado al backend */
export interface DetalleVentaRequest {
  idProducto:     number;
  cantidad:       number;
  precioUnitario: number;
  descuento:      number;   // monto fijo por línea (ej. 5.00). Backend calcula: (qty * precio) - descuento
}

/** Body completo enviado al backend */
export interface VentaRequest {
  tipoDocumento:         string;
  numeroDocumento:       string;
  estado:                EstadoVenta;
  referenciaTransaccion: string;
  idCliente:             number;
  idAlmacen:             number;
  idMetodoPago:          number;
  detalles:              DetalleVentaRequest[];
}

// ── DTOs que el backend devuelve ───────────────────────────────────────────

export interface DetalleVentaResponse {
  idDetalleVenta: number;
  idProducto:     number;
  cantidad:       number;
  precioUnitario: number;
  descuento:      number;
  subtotal:       number;
}

export interface VentaResponse {
  idVenta:               number;
  fechaVenta:            string;
  tipoDocumento:         string;
  numeroDocumento:       string;
  estado:                EstadoVenta;
  total:                 number;
  referenciaTransaccion: string;
  idCliente:             number;
  idAlmacen:             number;
  idMetodoPago:          number;
  detalles:              DetalleVentaResponse[];
}

// ── Modelo interno del formulario (solo para el frontend) ──────────────────

/** Fila editable en el formulario */
export interface LineaVentaForm {
  idProducto:     number | null;
  productoNombre: string;           // solo para mostrar en UI
  cantidad:       number;
  precioUnitario: number;
  descuentoMonto: number;           // monto fijo de descuento por línea
  subtotal:       number;           // calculado en frontend: (qty * precio) - descuento
}

/** Estado completo del formulario en el componente */
export interface VentaForm {
  tipoDocumento:         TipoDocumentoVenta | '';
  numeroDocumento:       string;
  referenciaTransaccion: string;
  idCliente:             number | null;
  clienteNombre:         string;
  idAlmacen:             number | null;
  idMetodoPago:          number | null;
  lineas:                LineaVentaForm[];
  subtotalBruto:         number;
  totalDescuentos:       number;
  total:                 number;
}
