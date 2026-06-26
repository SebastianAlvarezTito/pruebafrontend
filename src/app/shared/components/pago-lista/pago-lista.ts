import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { PagoService } from '../../../core/services/pago.service';
import { Pago } from '../../../core/models/pago.model';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-pago-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-lista.html',
  styleUrls: ['./pago-lista.css']
})
export class PagoListaComponent implements OnInit, OnDestroy {

  pagos: Pago[]          = [];
  pagosFiltrados: Pago[] = [];
  busqueda               = '';
  paginaActual           = 1;
  itemsPorPagina         = 5;
  Math                   = Math;

  private routerSub!: Subscription;

  constructor(private pagoService: PagoService, private router: Router) {}

  ngOnInit(): void {
    this.listar();

    // Recarga automática cada vez que se navega de vuelta a /pagos
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      filter((e: NavigationEnd) => e.urlAfterRedirects === '/pagos')
    ).subscribe(() => this.listar());
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  listar(): void {
    this.pagoService.listar().subscribe({
      next: (data) => {
        this.pagos = data;
        this.filtrar();
      },
      error: (err) => console.error('Error al cargar pagos:', err)
    });
  }

  filtrar(): void {
    const term = this.busqueda.toLowerCase();
    this.pagosFiltrados = this.pagos.filter(p =>
      p.idPago.toLowerCase().includes(term)                  ||
      p.idVentaRelacionada.toLowerCase().includes(term)      ||
      p.metodoPago.toLowerCase().includes(term)              ||
      p.referenciaTransaccion.toLowerCase().includes(term)
    );
    this.paginaActual = 1;
  }

  get pagosPaginados(): Pago[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.pagosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.pagosFiltrados.length / this.itemsPorPagina) || 1;
  }

  get totalMonto(): number {
    return this.pagos.reduce((acc, p) => acc + p.montoPago, 0);
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(n: number): void {
    if (n >= 1 && n <= this.totalPaginas) this.paginaActual = n;
  }

  agregarPago(): void {
    this.router.navigate(['/pagos/nuevo']);
  }

  editar(pago: Pago): void {
    this.router.navigate(['/pagos/editar', pago.id]);
  }

  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar este pago?')) {
      this.pagoService.eliminarLogico(id).subscribe(() => this.listar());
    }
  }

  getMetodoIcono(metodo: string): string {
    const iconos: Record<string, string> = {
      'Transferencia Bancaria': '🏦',
      'Efectivo':               '💵',
      'Tarjeta de Crédito':     '💳',
      'Tarjeta de Débito':      '💳',
      'Cheque':                 '📋'
    };
    return iconos[metodo] ?? '💰';
  }
}
