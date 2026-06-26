import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pago } from '../models/pago.model';

// Datos mock — solo frontend, sin backend
let PAGOS_MOCK: Pago[] = [
  {
    id: 1,
    idPago: '#PAG-00001',
    idVentaRelacionada: 'V-98721',
    montoPago: 1500.00,
    fechaPago: '2026-05-10',
    metodoPago: 'Transferencia Bancaria',
    referenciaTransaccion: 'TRF-20260510-001',
    estado: 'activo'
  },
  {
    id: 2,
    idPago: '#PAG-00002',
    idVentaRelacionada: 'V-98722',
    montoPago: 850.50,
    fechaPago: '2026-05-12',
    metodoPago: 'Efectivo',
    referenciaTransaccion: 'EFE-20260512-002',
    estado: 'activo'
  }
];

let contadorId = 3;

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  listar(): Observable<Pago[]> {
    return of(PAGOS_MOCK.filter(p => p.estado === 'activo'));
  }

  obtenerPorId(id: number): Observable<Pago | undefined> {
    return of(PAGOS_MOCK.find(p => p.id === id));
  }

  guardar(pago: Pago): Observable<Pago> {
    const nuevo: Pago = {
      ...pago,
      id: contadorId,
      idPago: `#PAG-${String(contadorId).padStart(5, '0')}`,
      estado: 'activo'
    };
    contadorId++;
    PAGOS_MOCK.push(nuevo);
    return of(nuevo);
  }

  actualizar(pago: Pago): Observable<Pago> {
    const idx = PAGOS_MOCK.findIndex(p => p.id === pago.id);
    if (idx !== -1) PAGOS_MOCK[idx] = { ...pago };
    return of(pago);
  }

  eliminarLogico(id: number): Observable<void> {
    const pago = PAGOS_MOCK.find(p => p.id === id);
    if (pago) pago.estado = 'eliminado';
    return of(void 0);
  }

  generarIdPago(): string {
    return `#PAG-${String(contadorId).padStart(5, '0')}`;
  }
}
