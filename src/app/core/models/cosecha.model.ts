export interface Cosecha {
  id: number;
  fecha: string;
  parcela: string;
  variedad: string;
  cantJabas: number;
  pesoNeto: number;
  estado: 'VERIFICADO' | 'PENDIENTE' | 'RECHAZADO';
}
