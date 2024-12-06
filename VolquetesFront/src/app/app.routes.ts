import { Routes } from '@angular/router';
import { AlquilerComponent } from './app-layout/body/volquetes-body/alquiler/alquiler.component.js';
import {configuracionesRoutes} from './app-layout/body/configuraciones-body/configuraciones.routes.js';


export const routes: Routes = [

  {path: 'config', children:configuracionesRoutes},

  { path: 'volquetes/alquileres', component: AlquilerComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' }, // Ruta por defecto
];



