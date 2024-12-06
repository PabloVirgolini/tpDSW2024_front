import { Routes } from '@angular/router';
import { authGuard } from '../../../services/guards/auth.guard.js';

export const configuracionesRoutes: Routes = [
      // -------   Con Lazy Loading
  {
    path: 'volquetes',
    loadComponent: () =>
      import('./consulta-volquete/consulta-volquete.component').then(
        (c) => c.ConsultaVolqueteComponent
      ),
  },

  {
    path: 'tiposVolquetes',
    loadComponent: () => import('./tipo-volquete/tipo-volquete.component').then(c => c.TipoVolqueteComponent)
  },
  
  {
    path: 'usuarios',
    loadComponent: () => import('./usuarios/usuarios.component').then(c => c.UsuariosComponent),
    canActivate:[authGuard]
  },
];
