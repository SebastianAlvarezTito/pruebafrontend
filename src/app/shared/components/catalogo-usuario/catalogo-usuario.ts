import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalogo-usuario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo-usuario.html',
  styleUrls: ['./catalogo-usuario.css']
})
export class CatalogoUsuarioComponent {

  productos = [

    {
      nombre: 'Vino Reserva',
      precio: 89.90,
      imagen: '/images/vino.jpg'
    },

    {
      nombre: 'Vino Premium',
      precio: 95.00,
      imagen: '/images/vino2.jpg'
    },

    {
      nombre: 'Gran Reserva',
      precio: 120.00,
      imagen: '/images/vino3.jpg'
    },

    {
      nombre: 'Cabernet Especial',
      precio: 110.00,
      imagen: '/images/vino4.jpg'
    },

    {
      nombre: 'Pisco Quebranta',
      precio: 85.00,
      imagen: '/images/pisco.jpg'
    },

    {
      nombre: 'Pisco Acholado',
      precio: 95.00,
      imagen: '/images/pisco2.jpg'
    },

    {
      nombre: 'Pisco Italia',
      precio: 105.00,
      imagen: '/images/pisco3.jpg'
    },

    {
      nombre: 'Pisco Reserva',
      precio: 125.00,
      imagen: '/images/pisco4.jpg'
    }

  ];

}