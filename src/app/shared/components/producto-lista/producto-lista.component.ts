import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../core/models/producto.model';
import { ProductoService } from '../../../core/services/producto.service';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

type FiltroEstado = 'Todos' | 'Activo' | 'Inactivo';

@Component({
  selector: 'app-producto-lista',
  standalone: true,
  imports: [CommonModule, ProductoFormComponent],
  templateUrl: './producto-lista.component.html',
  styleUrl: './producto-lista.component.css'
})
export class ProductoListaComponent implements OnInit {
  productoService = inject(ProductoService);

  mostrarForm = signal(false);
  productoEditar = signal<Producto | null>(null);
  filtroEstado = signal<FiltroEstado>('Todos');
  paginaActual = signal(1);
  readonly porPagina = 10;

  filtros: FiltroEstado[] = ['Todos', 'Activo', 'Inactivo'];

  estadoLabel(estado?: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  productosFiltrados = computed(() =>
    this.productoService.filtrarPorEstado(this.filtroEstado())
  );

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.productosFiltrados().length / this.porPagina))
  );

  productosPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return this.productosFiltrados().slice(inicio, inicio + this.porPagina);
  });

  paginasArray = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  mostrandoHasta = computed(() =>
    Math.min(this.paginaActual() * this.porPagina, this.productosFiltrados().length)
  );

  ngOnInit(): void {
    this.productoService.cargarTodos();
  }

  abrirFormNuevo(): void {
    this.productoEditar.set(null);
    this.mostrarForm.set(true);
  }

  abrirFormEditar(p: Producto): void {
    this.productoEditar.set(p);
    this.mostrarForm.set(true);
  }

  cerrarForm(): void {
    this.mostrarForm.set(false);
    this.productoEditar.set(null);
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Desea eliminar este producto?')) {
      this.productoService.eliminar(id).subscribe({
        error: () => alert('No se pudo eliminar el producto')
      });
    }
  }

  restaurar(id: number | undefined): void {
    if (!id) return;
    this.productoService.restaurar(id).subscribe({
      error: () => alert('No se pudo restaurar el producto')
    });
  }

  setFiltro(f: FiltroEstado): void {
    this.filtroEstado.set(f);
    this.paginaActual.set(1);
  }

  setPagina(p: number): void {
    if (p >= 1 && p <= this.totalPaginas()) this.paginaActual.set(p);
  }

  estadoBadgeClass(estado?: boolean): string {
    return estado ? 'badge--activo' : 'badge--inactivo';
  }

  formatPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(precio);
  }

  // Método para refrescar/recargar la lista
  recargarLista(): void {
    this.productoService.cargarTodos();
  }
}