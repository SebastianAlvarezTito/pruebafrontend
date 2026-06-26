import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Cosecha } from '../../../core/models/cosecha.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  cosechas: Cosecha[] = [];
  totalCosechado = 0;
  parcelaMasProductiva = '';
  variedadLider = '';

  // Paginación
  paginaActual = 1;
  itemsPorPagina = 5;
  Math = Math;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.listarCosechas().subscribe(data => {
      this.cosechas = data;
    });
    this.totalCosechado      = this.dashboardService.getTotalCosechado();
    this.parcelaMasProductiva = this.dashboardService.getParcelaMasProductiva();
    this.variedadLider        = this.dashboardService.getVariedadLider();
  }

  get cosechasPaginadas(): Cosecha[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.cosechas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.cosechas.length / this.itemsPorPagina);
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(n: number): void {
    if (n >= 1 && n <= this.totalPaginas) this.paginaActual = n;
  }

  exportarExcel(): void {
    // Función disponible al conectar el backend
  }

  nuevoIngreso(): void {
    // Función disponible al conectar el backend
  }
}
