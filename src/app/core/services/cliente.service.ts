import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = environment.apiUrl + '/api/clientes';

  // 🔹 State Signals globales leídos nativamente por tu HTML de Clientes
  clientes = signal<Cliente[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);

  // 🔹 Métricas calculadas reactivamente usando Signals Computed
  totalClientes = computed(() => this.clientes().length);

  activos = computed(() => this.clientes().filter((c) => c.estado === true).length);

  inactivos = computed(() => this.clientes().filter((c) => c.estado === false).length);

  tasaRetencion = computed(() => {
    const total = this.totalClientes();
    if (total === 0) return 0;
    return Math.round((this.activos() / total) * 100);
  });

  constructor(private http: HttpClient) {}

  // 🔄 Listar actualiza automáticamente el Signal de clientes para toda la app
  listar(): Observable<Cliente[]> {
    this.cargando.set(true);
    this.error.set(null);
    return this.http.get<Cliente[]>(this.apiUrl).pipe(
      tap({
        next: (data) => {
          this.clientes.set(data);
          this.cargando.set(false);
        },
        error: (err) => {
          this.error.set(err.message || 'Error de comunicación con el servidor');
          this.cargando.set(false);
        },
      }),
    );
  }

  obtenerPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // ➕ Al crear, editar o eliminar, refrescamos el estado llamando internamente a listar()
  crear(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente).pipe(tap(() => this.listar().subscribe()));
  }

  editar(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http
      .put<Cliente>(`${this.apiUrl}/${id}`, cliente)
      .pipe(tap(() => this.listar().subscribe()));
  }

  eliminar(id: number): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}/${id}/eliminar`, {})
      .pipe(tap(() => this.listar().subscribe()));
  }

  restaurar(id: number): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}/${id}/restaurar`, {})
      .pipe(tap(() => this.listar().subscribe()));
  }
}
