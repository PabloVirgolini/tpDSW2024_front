import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BurgerMenuComponent } from './burger-button/burger-button.component.js';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuariosService/usuarios.service.js';
import { LoginComponent } from './login/login/login.component.js';
import { AuthService } from '../../services/authService/auth.service.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, BurgerMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  logoPath = '/assets/logo.svg';

  private authSubscription: Subscription | null = null;
  nombreUsuario: string | null = null;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private userService: UsuariosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    this.authSubscription = this.authService.authenticatedUser$.subscribe(
      (nombre) => {
        this.nombreUsuario = nombre;
      }
    );
    if (token) {
      this.userService.checkToken().subscribe({
        next: (response: any) => {
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          console.error('Token check failed:', error);
          // Aquí hay que redirigir al login cuando lo tengamos armado
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loginAction() {
    this.authService.clearUser();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(LoginComponent, dialogConfig);
  }

  logout() {
    this.authService.clearUser();
    this.nombreUsuario = null;
    this.reloadPage();
  }

  reloadPage() {
    window.location.reload();
  }
}
