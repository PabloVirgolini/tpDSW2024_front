import { Routes } from '@angular/router';

import { AlquilerComponent } from './app-layout/body/volquetes-body/alquiler/alquiler.component.js';
import { authGuard } from './services/guards/auth.guard.js';


/*  Paso a LazyLoading todos los modules
import {ConsultaVolqueteComponent} from './app-layout/body/volquetes-body/consulta-volquete/consulta-volquete.component.js';
*/


export const routes: Routes = [

  // -------   Con Lazy Loading   (https://angular.dev/guide/routing/common-router-tasks#lazy-loading)  ---------------------
 {
    path: 'config/volquetes',
    loadComponent: () => import('./app-layout/body/configuraciones-body/consulta-volquete/consulta-volquete.component.js').then(c => c.ConsultaVolqueteComponent)
  },
  {
    path: 'config/tiposVolquetes',
    loadComponent: () => import('./app-layout/body/configuraciones-body/tipo-volquete/tipo-volquete.component').then(c => c.TipoVolqueteComponent)
  },
  {
    path: 'config/usuarios',
    loadComponent: () => import('./app-layout/body/configuraciones-body/usuarios/usuarios.component').then(c => c.UsuariosComponent),
    canActivate:[authGuard]
  },

  
  // -------   Sin Lazy Loading sería:  ---------------------

  // import { VolquetesBodyComponent } from './app-layout/body/volquetes-body/volquetes-body.component.js';
  // import { TipoVolqueteComponent } from './app-layout/body/configuraciones-body/tipo-volquete/tipo-volquete.component.js';
  // import { UsuariosComponent } from './app-layout/body/configuraciones-body/usuarios/usuarios.component.js';

  //{ path: 'config/usuarios', component: UsuariosComponent },
  // { path: 'config/volquetes', component: ConsultaVolqueteComponent },
  //{ path: 'config/tiposVolquetes', component: TipoVolqueteComponent },

  //{ path: 'app-consulta-volquete', component: VolquetesBodyComponent },


  { path: 'volquetes/alquileres', component: AlquilerComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' }, // Ruta por defecto
];



