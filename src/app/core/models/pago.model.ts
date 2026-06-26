export interface Pago {
  id?: number;
  idPago: string;
  idVentaRelacionada: string;
  montoPago: number;
  fechaPago: string;
  metodoPago: string;
  referenciaTransaccion: string;
  estado?: 'activo' | 'eliminado';
}
