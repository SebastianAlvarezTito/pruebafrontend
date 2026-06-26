import { Routes } from '@angular/router';
import { InicioComponent } from './shared/components/inicio/inicio';
import { DashboardComponent } from './shared/components/dashboard/dashboard';
import { ClienteListaComponent } from './shared/components/cliente-lista/cliente-lista.component';
import { AlmacenListaComponent } from './shared/components/almacen-lista/almacen-lista.component';
import { AlmacenFormComponent } from './shared/components/almacen-form/almacen-form.component';
import { PagoListaComponent } from './shared/components/pago-lista/pago-lista';
import { PagoFormComponent } from './shared/components/pago-form/pago-form';
import { ProductoListaComponent } from './shared/components/producto-lista/producto-lista.component';
import { ProductoFormComponent } from './shared/components/producto-form/producto-form.component';
import { VentaListaComponent } from './shared/components/venta-lista/venta-lista.component';
import { VentaFormComponent } from './shared/components/venta-form/venta-form.component';
import { PortadaUsuario}from './shared/components/portada-usuario/portada-usuario'; 
import { CatalogoUsuarioComponent } from './shared/components/catalogo-usuario/catalogo-usuario';
export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio',            component: InicioComponent        },
  { path: 'dashboard',         component: DashboardComponent     },
  { path: 'clientes',          component: ClienteListaComponent  },
  { path: 'almacenes',         component: AlmacenListaComponent  },
  { path: 'almacen/nuevo',     component: AlmacenFormComponent   },
  { path: 'almacen/editar/:id',component: AlmacenFormComponent   },
  { path: 'pagos',             component: PagoListaComponent     },
  { path: 'pago/nuevo',        component: PagoFormComponent      },
  { path: 'pago/editar/:id',   component: PagoFormComponent      },
  { path: 'productos',         component: ProductoListaComponent },
  { path: 'producto/nuevo',    component: ProductoFormComponent  },
  { path: 'producto/editar/:id', component: ProductoFormComponent },
  { path: 'ventas',            component: VentaListaComponent    },
  { path: 'ventas/nueva',      component: VentaFormComponent     },
  { path: 'portada', component: PortadaUsuario },
{ path: 'catalogo', component: CatalogoUsuarioComponent },
];