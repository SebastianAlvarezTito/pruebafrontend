import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Almacen } from '../models/almacen.model'; // ✅ Apunta directo a tu modelo de arriba
import { environment } from '../../../environments/environment'
@Injectable({
  providedIn: 'root' // ✅ Crucial para resolver el error de Injection Token (NG2003)
})
export class AlmacenService {
  

  private apiUrl = environment.apiUrl + '/api/almacen';
  constructor(private http: HttpClient) {}

  // 1. OBTENER TODOS LOS ALMACENES
  listar(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(this.apiUrl);
  }

  // 2. OBTENER UN ALMACÉN POR ID (Para la Edición)
  obtenerPorId(id: number): Observable<Almacen> {
    return this.http.get<Almacen>(`${this.apiUrl}/${id}`);
  }

  // 3. CREAR UN NUEVO ALMACÉN
  crear(almacen: Almacen): Observable<Almacen> {
    return this.http.post<Almacen>(this.apiUrl, almacen);
  }

  // 4. ACTUALIZAR / EDITAR UN ALMACÉN EXISTENTE
  editar(id: number, almacen: Almacen): Observable<Almacen> {
    return this.http.put<Almacen>(`${this.apiUrl}/${id}`, almacen);
  }

  // 5. ELIMINADO LÓGICO (Cambia el estado a Inactivo usando PATCH / Parche)
  eliminar(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/eliminar`, {});
  }

  // 6. RESTAURADO LÓGICO (Cambia el estado a Activo usando PATCH / Parche)
  restaurar(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/restaurar`, {});
  }
}