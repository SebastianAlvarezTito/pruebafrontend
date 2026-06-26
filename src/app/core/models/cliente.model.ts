export type TipoDocumento = 'DNI' | 'PAS' | 'CE' | 'RUC';
export type EstadoCliente = 'Activo' | 'Inactivo' | 'Pendiente';

/** Mapeo exacto con el backend Spring Boot */
export interface Cliente {
  id?: number;                    // id_cliente (Integer en Java)
  tipoDocumento: TipoDocumento;   // tipo_documento
  numeroDocum: string;            // numero_docum
  nombre: string;                 // nombre
  apellido: string;               // apellido
  correo: string;                 // correo
  telefono: string;               // telefono
  fechaNacimiento: string;        // fecha_nacimiento (LocalDate → "YYYY-MM-DD")
  ubigeoId: string;               // ubigeo_id (6 dígitos, obligatorio)
  estado?: boolean;               // estado (true=Activo, false=Inactivo)
  fechaCreacion?: string;         // fecha_creacion
  fechaActualizacion?: string;    // fecha_actualizacion
  fechaEliminacion?: string;      // fecha_eliminacion
  fechaRestauracion?: string;     // fecha_restauracion
}

/** Helper: boolean backend → label UI */
export function estadoLabel(estado?: boolean): EstadoCliente {
  if (estado === true)  return 'Activo';
  if (estado === false) return 'Inactivo';
  return 'Pendiente';
}