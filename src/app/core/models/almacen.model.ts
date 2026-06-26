export type TipoProducto =
  | 'Vino Tinto'
  | 'Vino Blanco'
  | 'Vino Rosado'
  | 'Espumante'
  | 'Destilado';

export interface Almacen {
  idAlmacen?: number;
  nombre: string;
  ubicacion: string;
  telefono: string;
  responsable: string;
  codigoAlmacen?: string;
  tipoProducto: string;
  cantidadBotellas: number;
  estado: string | boolean; // ✅ Mantenemos la propiedad y agregamos soporte booleano para que no crasheé con este repo
  ubigeoId: string; // ✅ Mantenemos la propiedad tal cual pides
  fechaCreacion?: string;
  fechaActualizacion?: string;
  fechaEliminacion?: string;
  fechaRestauracion?: string;
}

export const PREFIJOS_TIPO: Record<TipoProducto, string> = {
  'Vino Tinto': 'VB',
  'Vino Blanco': 'VB',
  'Vino Rosado': 'VB',
  'Espumante': 'VB',
  'Destilado': 'VB',
};

export const TIPOS_PRODUCTO: TipoProducto[] = [
  'Vino Tinto',
  'Vino Blanco',
  'Vino Rosado',
  'Espumante',
  'Destilado', // ✅ Sintaxis corregida aquí
];