import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  message?: string;
  rol?: string;
}

// Credenciales de prueba (solo frontend)
const USUARIOS_PRUEBA = [
  {
    email: 'admin@peirano.com',
    password: 'admin123',
    rol: 'ADMIN'
  },
  {
    email: 'usuario@peirano.com',
    password: 'usuario123',
    rol: 'USUARIO'
  }
];

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  login(email: string, password: string): Observable<LoginResponse> {

    const usuario = USUARIOS_PRUEBA.find(
      u => u.email === email && u.password === password
    );

    if (usuario) {
      localStorage.setItem('token', 'mock-token-peirano');
      localStorage.setItem('rol', usuario.rol);

      return of({
        token: 'mock-token-peirano',
        message: 'Login exitoso',
        rol: usuario.rol
      });
    }

    return throwError(() => new Error('Credenciales incorrectas'));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }
}