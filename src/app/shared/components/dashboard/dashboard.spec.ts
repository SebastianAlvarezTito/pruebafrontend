import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { DashboardService } from '../../services/dashboard.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;

  beforeEach(async () => {
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [
      'listarCosechas', 'getTotalCosechado', 'getParcelaMasProductiva', 'getVariedadLider'
    ]);
    dashboardServiceSpy.listarCosechas.and.returnValue(of([]));
    dashboardServiceSpy.getTotalCosechado.and.returnValue(12450.50);
    dashboardServiceSpy.getParcelaMasProductiva.and.returnValue('San José');
    dashboardServiceSpy.getVariedadLider.and.returnValue('Quebranta');

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: DashboardService, useValue: dashboardServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on init', () => {
    expect(component.totalCosechado).toBe(12450.50);
    expect(component.parcelaMasProductiva).toBe('San José');
    expect(component.variedadLider).toBe('Quebranta');
  });
});
