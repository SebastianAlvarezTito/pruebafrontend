import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoListaComponent } from './pago-lista';
import { PagoService } from '../../services/pago.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Pago } from '../../models/pago.model';

const PAGOS_MOCK: Pago[] = [
  { id: 1, idPago: '#PAG-00001', idVentaRelacionada: 'V-1', montoPago: 100, fechaPago: '2026-05-10', metodoPago: 'Efectivo', referenciaTransaccion: 'REF-001', estado: 'activo' },
  { id: 2, idPago: '#PAG-00002', idVentaRelacionada: 'V-2', montoPago: 200, fechaPago: '2026-05-11', metodoPago: 'Transferencia Bancaria', referenciaTransaccion: 'REF-002', estado: 'activo' },
];

describe('PagoListaComponent', () => {
  let component: PagoListaComponent;
  let fixture: ComponentFixture<PagoListaComponent>;
  let pagoServiceSpy: jasmine.SpyObj<PagoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    pagoServiceSpy = jasmine.createSpyObj('PagoService', ['listar', 'eliminarLogico']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    pagoServiceSpy.listar.and.returnValue(of(PAGOS_MOCK));

    await TestBed.configureTestingModule({
      imports: [PagoListaComponent],
      providers: [
        { provide: PagoService, useValue: pagoServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pagos on init', () => {
    expect(component.pagos.length).toBe(2);
  });

  it('should calculate total monto', () => {
    expect(component.totalMonto).toBe(300);
  });

  it('should navigate to /pagos/nuevo on agregarPago', () => {
    component.agregarPago();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pagos/nuevo']);
  });
});
