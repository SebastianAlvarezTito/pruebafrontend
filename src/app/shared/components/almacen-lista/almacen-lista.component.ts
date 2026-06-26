import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlmacenService } from '../../../core/services/almacen.service'; // 👈 Ruta real a tu carpeta core
import { Almacen } from '../../../core/models/almacen.model'; // 👈 Ruta real a tu carpeta core

@Component({
  selector: 'app-almacen-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './almacen-lista.component.html',
  styleUrls: ['./almacen-lista.component.css'],
})
export class AlmacenListaComponent implements OnInit {

  // Variables exactas que tu HTML lee sin usar paréntesis ()
  almacenes: Almacen[] = [];
  busqueda = '';

  paginaActual = 1;
  itemsPorPagina = 5;

  cargando = false;
  errorCarga = '';

  Math = Math;

  constructor(
    private almacenService: AlmacenService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  // LISTAR (Garantiza el mapeo exacto de campos consumiendo tu nuevo AlmacenService)
  listar(): void {
    this.cargando = true;
    this.errorCarga = '';

    this.almacenService.listar().subscribe({
      next: (data: any[]) => {
        this.almacenes = data.map(item => ({
          idAlmacen: item.idAlmacen ?? item.id_almacen,
          nombre: item.nombre ?? '',
          ubicacion: item.ubicacion ?? '',
          telefono: item.telefono ?? '',
          responsable: item.responsable ?? '',
          codigoAlmacen: item.codigoAlmacen ?? item.codigo_almacen ?? 'VB-XXXX',
          tipoProducto: item.tipoProducto ?? item.tipo_producto ?? '',
          cantidadBotellas: item.cantidadBotellas ?? item.cantidad_botellas ?? item.totalBotellas ?? 0,
          estado: item.estado ?? 'Activo',
          ubigeoId: item.ubigeoId ?? item.ubigeo_id ?? '------'
        }));
        
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en el listado de almacenes:', err);
        this.errorCarga = err.message || 'Error al conectar con el backend';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🗑️ ELIMINADO LÓGICO
  eliminar(id: number): void {
    if (!confirm('¿Deseas desactivar (eliminar lógicamente) este almacén?')) return;

    this.almacenService.eliminar(id).subscribe({
      next: () => this.listar(),
      error: () => alert('Error al desactivar el almacén.')
    });
  }

  // ♻️ RESTAURADO LÓGICO
  restaurar(id: number): void {
    if (!confirm('¿Deseas restaurar lógicamente este almacén a estado Activo?')) return;

    this.almacenService.restaurar(id).subscribe({
      next: () => this.listar(),
      error: () => alert('Error al restaurar el almacén.')
    });
  }

  // ✏️ EDITAR (Corregido al singular exacto de tus rutas: /almacen/editar)
  editar(almacen: Almacen): void {
    if (almacen.idAlmacen) {
      this.router.navigate(['/almacen/editar', almacen.idAlmacen]); // 👈 Solucionado el error de rutas cambiando a singular
    } else {
      alert('Error: El almacén seleccionado no tiene un ID válido.');
    }
  }

  // ➕ NUEVO (Corregido al singular exacto de tus rutas: /almacen/nuevo)
  nuevoAlmacen(): void {
    this.router.navigate(['/almacen/nuevo']); // 👈 Solucionado el error de rutas cambiando a singular
  }

  // 🔍 FILTRO (Consumido por el bucle @for de tu HTML)
  get almacenesFiltrados(): Almacen[] {
    const t = this.busqueda.toLowerCase().trim();
    if (!t) return this.almacenes;

    return this.almacenes.filter(a =>
      a.nombre?.toLowerCase().includes(t) ||
      a.codigoAlmacen?.toLowerCase().includes(t) ||
      a.responsable?.toLowerCase().includes(t)
    );
  }

  // 📄 PAGINACIÓN (Consumido por el bucle @for de tu HTML)
  get almacenesPaginados(): Almacen[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.almacenesFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.almacenesFiltrados.length / this.itemsPorPagina) || 1;
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  irAPagina(p: number): void {
    this.paginaActual = p;
  }

  // 🍾 TOTAL BOTELLAS (Calculado en tiempo real para tu tarjeta superior)
  get totalBotellas(): number {
    return this.almacenes.reduce((a, b) => a + (b.cantidadBotellas ?? 0), 0);
  }
}