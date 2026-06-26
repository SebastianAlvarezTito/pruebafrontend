import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { InicioService } from '../../../core/services/inicio.service';

interface NavItem { icon: string; label: string; route: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { icon: 'dashboard',   label: 'Dashboard',  route: '/dashboard'      },
    { icon: 'inventory_2', label: 'Inventario', route: '/almacenes'      },
    { icon: 'description', label: 'Registros',  route: '/registros'      },
    { icon: 'payments',    label: 'Pagos',       route: '/pagos'          },
    { icon: 'point_of_sale', label: 'Ventas',   route: '/ventas'         },
    { icon: 'group',       label: 'Clientes',    route: '/clientes'       },
    { icon: 'agriculture', label: 'Productos',   route: '/productos'      },
  ];

  constructor(private inicioService: InicioService, private router: Router) {}

  cerrarSesion(): void {
    this.inicioService.logout();
    this.router.navigate(['/inicio']);
  }
}
