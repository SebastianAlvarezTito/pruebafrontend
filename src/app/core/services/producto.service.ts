import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Producto } from '../models/producto.model';
import { environment } from '../../../environments/environment'

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = environment.apiUrl + '/api/producto';
  private http = inject(HttpClient);

  // [COMMIT 2] Log de depuración en constructor
  constructor() {
    console.log('[ProductoService] Servicio inicializado correctamente');
  }

  // Señales para el estado global
  private productosSignal = signal<Producto[]>([]);
  public productos = this.productosSignal.asReadonly();

  private cargandoSignal = signal(false);
  public cargando = this.cargandoSignal.asReadonly();

  private errorSignal = signal<string | null>(null);
  public error = this.errorSignal.asReadonly();

  // Computed signals para estadísticas
  get totalProductos(): number {
    return this.productosSignal().length;
  }

  get activos(): number {
    return this.productosSignal().filter(p => p.estado === true).length;
  }

  get inactivos(): number {
    return this.productosSignal().filter(p => p.estado === false).length;
  }

  get tasaDisponibilidad(): number {
    if (this.totalProductos === 0) return 0;
    return Math.round((this.activos / this.totalProductos) * 100);
  }

  cargarTodos(): void {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => {
        // [COMMIT 2] Log de depuración al cargar productos
        console.log(`[ProductoService] ${data.length} productos cargados desde API`);
        this.productosSignal.set(data);
        this.cargandoSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Error al cargar productos');
        this.cargandoSignal.set(false);
        console.error(err);
      }
    });
  }

  crear(producto: Omit<Producto, 'idProducto'>): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto).pipe(
      tap((nuevo) => {
        this.productosSignal.update(lista => [...lista, nuevo]);
      })
    );
  }

  editar(id: number, producto: Omit<Producto, 'idProducto'>): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto).pipe(
      tap((actualizado) => {
        this.productosSignal.update(lista =>
          lista.map(p => p.idProducto === id ? actualizado : p)
        );
      })
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/eliminar/${id}`, {}).pipe(
      tap(() => {
        this.productosSignal.update(lista =>
          lista.map(p => p.idProducto === id ? { ...p, estado: false } : p)
        );
      })
    );
  }

  restaurar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/restaurar/${id}`, {}).pipe(
      tap(() => {
        this.productosSignal.update(lista =>
          lista.map(p => p.idProducto === id ? { ...p, estado: true } : p)
        );
      })
    );
  }

  // Filtro por estado
  filtrarPorEstado(filtro: 'Todos' | 'Activo' | 'Inactivo'): Producto[] {
    const lista = this.productosSignal();
    if (filtro === 'Activo') return lista.filter(p => p.estado === true);
    if (filtro === 'Inactivo') return lista.filter(p => p.estado === false);
    return lista;
  }
}