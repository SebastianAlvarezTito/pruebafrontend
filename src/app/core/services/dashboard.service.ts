import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cosecha } from '../models/cosecha.model';

const COSECHAS_MOCK: Cosecha[] = [
  { id: 1,  fecha: '2023-10-12', parcela: 'San José',      variedad: 'Quebranta', cantJabas: 145, pesoNeto: 2900.00, estado: 'VERIFICADO' },
  { id: 2,  fecha: '2023-10-12', parcela: 'La Esperanza',  variedad: 'Italia',    cantJabas: 98,  pesoNeto: 1960.50, estado: 'VERIFICADO' },
  { id: 3,  fecha: '2023-10-11', parcela: 'San José',      variedad: 'Quebranta', cantJabas: 120, pesoNeto: 2400.00, estado: 'PENDIENTE'  },
  { id: 4,  fecha: '2023-10-11', parcela: 'Santa Rosa',    variedad: 'Torontel',  cantJabas: 85,  pesoNeto: 1700.00, estado: 'VERIFICADO' },
  { id: 5,  fecha: '2023-10-10', parcela: 'San José',      variedad: 'Quebranta', cantJabas: 172, pesoNeto: 3440.00, estado: 'VERIFICADO' },
  { id: 6,  fecha: '2023-10-09', parcela: 'La Esperanza',  variedad: 'Torontel',  cantJabas: 110, pesoNeto: 2200.00, estado: 'VERIFICADO' },
  { id: 7,  fecha: '2023-10-08', parcela: 'Santa Rosa',    variedad: 'Italia',    cantJabas: 95,  pesoNeto: 1900.00, estado: 'PENDIENTE'  },
  { id: 8,  fecha: '2023-10-07', parcela: 'San José',      variedad: 'Quebranta', cantJabas: 160, pesoNeto: 3200.00, estado: 'VERIFICADO' },
];

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  listarCosechas(): Observable<Cosecha[]> {
    return of(COSECHAS_MOCK);
  }

  getTotalCosechado(): number {
    return COSECHAS_MOCK.reduce((acc, c) => acc + c.pesoNeto, 0);
  }

  getParcelaMasProductiva(): string {
    const totales: Record<string, number> = {};
    COSECHAS_MOCK.forEach(c => {
      totales[c.parcela] = (totales[c.parcela] ?? 0) + c.pesoNeto;
    });
    return Object.entries(totales).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';
  }

  getVariedadLider(): string {
    const totales: Record<string, number> = {};
    COSECHAS_MOCK.forEach(c => {
      totales[c.variedad] = (totales[c.variedad] ?? 0) + c.pesoNeto;
    });
    return Object.entries(totales).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';
  }
}
