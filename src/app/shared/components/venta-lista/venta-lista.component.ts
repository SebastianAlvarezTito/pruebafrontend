import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { VentaService } from '../../../core/services/venta.service';
import { VentaResponse } from '../../../core/models/venta.model';

@Component({
  selector: 'app-venta-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta-lista.component.html',
  styleUrls: ['./venta-lista.component.css']
})
export class VentaListaComponent implements OnInit, OnDestroy {

  ventas:         VentaResponse[] = [];
  ventasFiltradas: VentaResponse[] = [];
  busqueda      = '';
  paginaActual  = 1;
  porPagina     = 8;
  Math          = Math;

  private routerSub!: Subscription;

  constructor(
    public  ventaService: VentaService,
    private router:       Router
  ) {}

  ngOnInit(): void {
    this.listar();

    // Recarga automática al volver a /ventas
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      filter((e: NavigationEnd) => e.urlAfterRedirects === '/ventas')
    ).subscribe(() => this.listar());
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  listar(): void {
    this.ventaService.listar().subscribe({
      next: data => {
        this.ventas = data;
        this.filtrar();
      },
      error: err => console.error('Error al cargar ventas:', err)
    });
  }

  filtrar(): void {
    const term = this.busqueda.toLowerCase().trim();
    this.ventasFiltradas = !term
      ? [...this.ventas]
      : this.ventas.filter(v =>
          v.idVenta.toString().includes(term)                     ||
          v.tipoDocumento.toLowerCase().includes(term)            ||
          v.numeroDocumento.toLowerCase().includes(term)          ||
          v.referenciaTransaccion.toLowerCase().includes(term)
        );
    this.paginaActual = 1;
  }

  // ── Paginación ────────────────────────────────────────────────────────────

  get ventasPagina(): VentaResponse[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.ventasFiltradas.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.ventasFiltradas.length / this.porPagina) || 1;
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  setPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas) this.paginaActual = p;
  }

  // ── Métricas ──────────────────────────────────────────────────────────────

  get totalVentas(): number    { return this.ventas.length; }
  get ventasActivas(): number  { return this.ventas.filter(v => v.estado === 'C').length; }
  get ventasAnuladas(): number { return this.ventas.filter(v => v.estado === 'A').length; }
  get totalIngresos(): number  {
    return this.ventas
      .filter(v => v.estado === 'C')
      .reduce((acc, v) => acc + v.total, 0);
  }

  // ── Acciones ──────────────────────────────────────────────────────────────

  nuevaVenta(): void {
    this.router.navigate(['/ventas/nueva']);
  }

  anular(id: number): void {
    if (!confirm('¿Está seguro de anular esta venta? Esta acción no se puede revertir.')) return;
    this.ventaService.anular(id).subscribe({
      next: () => this.listar(),
      error: err => console.error('Error al anular venta:', err)
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency', currency: 'PEN'
    }).format(value ?? 0);
  }

  estadoLabel(estado: string): string {
    return estado === 'C' ? 'Confirmada' : 'Anulada';
  }
}
