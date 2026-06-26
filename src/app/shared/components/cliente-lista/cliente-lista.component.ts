import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente, estadoLabel, EstadoCliente } from '../../../core/models/cliente.model';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';

@Component({
  selector: 'app-cliente-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, ClienteFormComponent],
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css'],
})
export class ClienteListaComponent implements OnInit {
  mostrarForm = signal<boolean>(false);
  clienteEditar = signal<Cliente | null>(null);
  filtroEstado = signal<string>('TODOS'); // 'TODOS', 'Activo', 'Inactivo'
  paginaActual = signal<number>(1);

  filtros: string[] = ['TODOS', 'Activo', 'Inactivo'];
  busqueda = '';
  porPagina = 5;

  clientesFiltrados = computed(() => {
    let lista = this.clienteService.clientes();
    const query = this.busqueda.toLowerCase().trim();
    const estadoFiltro = this.filtroEstado();

    if (query) {
      lista = lista.filter(
        (c) =>
          c.nombre.toLowerCase().includes(query) ||
          c.apellido.toLowerCase().includes(query) ||
          c.numeroDocum.includes(query),
      );
    }

    if (estadoFiltro !== 'TODOS') {
      lista = lista.filter((c) => estadoLabel(c.estado) === estadoFiltro);
    }

    return lista;
  });

  clientesPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    const fin = inicio + this.porPagina;
    return this.clientesFiltrados().slice(inicio, fin);
  });

  totalPaginas = computed(() => Math.ceil(this.clientesFiltrados().length / this.porPagina) || 1);

  paginasArray = computed(() => {
    const paginas = [];
    for (let i = 1; i <= this.totalPaginas(); i++) {
      paginas.push(i);
    }
    return paginas;
  });

  mostrandoHasta = computed(() => {
    const hasta = this.paginaActual() * this.porPagina;
    const total = this.clientesFiltrados().length;
    return hasta > total ? total : hasta;
  });

  constructor(public clienteService: ClienteService) {}

  ngOnInit(): void {
    this.clienteService.listar().subscribe();
  }

  abrirFormNuevo(): void {
    this.clienteEditar.set(null);
    this.mostrarForm.set(true);
  }

  abrirFormEditar(cliente: Cliente): void {
    this.clienteEditar.set(cliente);
    this.mostrarForm.set(true);
  }

  cerrarForm(): void {
    this.mostrarForm.set(false);
    this.clienteEditar.set(null);
  }

  setFiltro(filtro: string): void {
    this.filtroEstado.set(filtro);
    this.paginaActual.set(1);
  }

  setPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  // Mapeos usando tu helper importado directamente
  estadoLabel(estado?: boolean): EstadoCliente {
    return estadoLabel(estado);
  }

  estadoBadgeClass(estado?: boolean): string {
    return estado === true ? 'badge--activo' : 'badge--inactivo';
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Está seguro de inactivar este cliente?')) {
      this.clienteService.eliminar(id).subscribe();
    }
  }

  restaurar(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Desea restaurar y activar a este cliente?')) {
      this.clienteService.restaurar(id).subscribe();
    }
  }
}
