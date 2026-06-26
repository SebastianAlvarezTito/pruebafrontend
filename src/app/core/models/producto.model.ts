export interface Producto {
  /** Identificador único del producto (autogenerado) */
  idProducto?: number;
  /** Nombre comercial del producto */
  nombre: string;
  /** Descripción detallada (opcional) */
  descripcion?: string;
  /** Código de barras o SKU único */
  codigoBarrasSku: string;
  /** Unidad de medida: 750ml, 1 Litro, 500ml, Galon 4 Lt, Pack */
  unidadMedida: string;
  /** Precio unitario en soles (mínimo 0.01) */
  precioUnitario: number;
  /** Estado: true = activo, false = inactivo/eliminado */
  estado: boolean;
  /** ID de categoría (1-15 según catálogo) */
  idCategoria: number;
  /** Fecha de creación (ISO string) */
  fechaCreacion?: string;
  /** Fecha de última actualización */
  fechaActualizacion?: string;
  /** Fecha de eliminación lógica */
  fechaEliminacion?: string;
  /** Fecha de restauración */
  fechaRestauracion?: string;
}