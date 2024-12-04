import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { SideBarOption } from './sidebar.interface.js';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/authService/auth.service.js';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy{
  private fixed = true;
  public collapsed = false;
  public expandedOption: string | null = null;

  private authSubscription: Subscription | null = null;
  tipoUsuario:string | null = null;

  constructor(
    private authService: AuthService
  ){}

  public sidebarOptions: SideBarOption[] = [
    {
      user: ['admin', 'Usuario'],
      name: 'Volquetes',
      picture: 'assets/sidebar-icons/Alquileres.png',
      route: '/volquetes',
      tooltipText: 'Volquetes',
    },

    {
      user: ['admin', 'Usuario'],
      name: 'Gastos',
      picture: 'assets/sidebar-icons/Gastos.png',
      route: '/gastos',
      tooltipText: 'Gastos',
      subOptions: [
        { name: 'Ordenes de Compra', route: '/sub-opcion-1' },
        { name: 'Proveedores', route: '/proveedores' },
        { name: 'Materiales', route: '/sub-opcion-3' },
      ],
    },
    {
      user: ['admin'],
      name: 'Configuraciones',
      picture: 'assets/sidebar-icons/Configuraciones.png',
      route: '/configuraciones',
      tooltipText: 'Configuraciones',
      subOptions: [
        { name: 'Usuarios', route: 'config/usuarios' },
        { name: 'Tipos de Volquetes', route: 'config/tiposVolquetes' },
        { name: 'Alquilar Volquete', route: 'config/alquileres' },
      ],
    },
  ];


  @Output() opened = new EventEmitter<any>();

  toggleOptions(option: any) {
    if (!this.collapsed) {
      this.toggleSuboptions(option);
    } else {
      this.toggleCollapse();
    }
  }

  toggleSuboptions(option: any) {
    this.toggleExpand(option);
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    // Implement your logic here to toggle the sidebar collapse state
    if (this.expandedOption) {
      this.toggleExpand(this.expandedOption);
    }
    console.log(this.collapsed);
    // You can add logic here to change the sidebar's appearance or state
  }

  toggleExpand(option: any) {
    this.expandedOption =
      this.expandedOption === option.name ? null : option.name;
  }

  tooltipText(option: any): string {
    return this.collapsed ? option.tooltipText : '';
  }

  ngOnInit(): void {
    //Me suscribo a los cambios de Auth
    this.authSubscription = this.authService.authenticatedUserRole$.subscribe(
      (rol) => {
        this.tipoUsuario = rol;
      }
    );
    // this.tipoUsuario = localStorage.getItem('rol')

  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
