import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioComponent } from './inicio';
import { InicioService } from '../../services/inicio.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;
  let inicioServiceSpy: jasmine.SpyObj<InicioService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    inicioServiceSpy = jasmine.createSpyObj('InicioService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [
        { provide: InicioService, useValue: inicioServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if fields are empty', () => {
    component.email = '';
    component.password = '';
    component.iniciarSesion();
    expect(component.errorMsg).toBe('Por favor complete todos los campos.');
  });

  it('should navigate to /clientes on successful login', () => {
    inicioServiceSpy.login.and.returnValue(of({}));
    component.email = 'admin@peirano.com';
    component.password = '123456';
    component.iniciarSesion();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/clientes']);
  });

  it('should show error message on failed login', () => {
    inicioServiceSpy.login.and.returnValue(throwError(() => new Error('Unauthorized')));
    component.email = 'admin@peirano.com';
    component.password = 'wrong';
    component.iniciarSesion();
    expect(component.errorMsg).toBe('Credenciales incorrectas. Intente nuevamente.');
  });
});
