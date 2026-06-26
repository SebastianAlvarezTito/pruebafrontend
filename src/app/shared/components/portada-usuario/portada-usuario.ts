import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-portada-usuario',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './portada-usuario.html',
  styleUrl: './portada-usuario.css'
})
export class PortadaUsuario {

  vinos = [
    {
      id: 1,
      nombre: 'Quebranta Premium',
      precio: 85,
      imagen: '/images/pisco.jpg'
    },
    {
      id: 2,
      nombre: 'Pisco Reserva Especial',
      precio: 95,
      imagen: '/images/pisco2.jpg'
    },
    {
      id: 3,
      nombre: 'Acholado Selecto',
      precio: 75,
      imagen: '/images/pisco3.jpg'
    },
    {
      id: 4,
      nombre: 'Gran Reserva Peirano',
      precio: 120,
      imagen: '/images/pisco4.jpg'
    }
  ];

}