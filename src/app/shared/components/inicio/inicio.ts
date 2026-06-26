import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InicioService } from '../../../core/services/inicio.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent {

  email: string = '';
  password: string = '';
  recordarme: boolean = false;
  errorMsg: string = '';
  cargando: boolean = false;

  constructor(
    private inicioService: InicioService,
    private router: Router
  ) {}

  iniciarSesion(): void {

    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor complete todos los campos.';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    this.inicioService.login(this.email, this.password).subscribe({

      next: (response) => {

        this.cargando = false;

        if (response.rol === 'ADMIN') {

          this.router.navigate(['/dashboard']);

        } else if (response.rol === 'USUARIO') {

          this.router.navigate(['/portada']);

        }

      },

      error: (err) => {

        this.cargando = false;
        this.errorMsg = 'Credenciales incorrectas. Intente nuevamente.';
        console.error('Error de autenticación:', err);

      }

    });

  }

}