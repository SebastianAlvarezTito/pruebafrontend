import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoFormComponent } from './pago-form';
import { PagoService } from '../../services/pago.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('PagoFormComponent', () => {
  let component: PagoFormComponent;
  let fixture: ComponentFixture<PagoFormComponent>;
  let pagoServiceSpy: jasmine.SpyObj<PagoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    pagoServiceSpy = jasmine.createSpyObj('PagoService', ['guardar', 'generarIdPago']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    pagoServiceSpy.generarIdPago.and.returnValue('#PAG-00003');

    await TestBed.configureTestingModule({
      imports: [PagoFormComponent],
      providers: [
        { provide: PagoService, useValue: pagoServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate idPago on init', () => {
    expect(component.pago.idPago).toBe('#PAG-00003');
  });

  it('should show error if required fields are empty', () => {
    component.guardar();
    expect(component.errorMsg).toBeTruthy();
  });

  it('should navigate to /pagos after saving', () => {
    pagoServiceSpy.guardar.and.returnValue(of({ idPago: '#PAG-00003', idVentaRelacionada: 'V-1', montoPago: 100, fechaPago: '2026-05-15', metodoPago: 'Efectivo', referenciaTransaccion: 'REF-001' }));
    component.pago = { idPago: '#PAG-00003', idVentaRelacionada: 'V-1', montoPago: 100, fechaPago: '2026-05-15', metodoPago: 'Efectivo', referenciaTransaccion: 'REF-001' };
    component.guardar();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/pagos']);
  });
});
