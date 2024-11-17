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
    //Me suscribo a los cambios de Auth
    this.authSubscription = this.authService.authenticatedUser$.subscribe(
      (nombre) => {
        this.nombreUsuario = nombre;
      }
    );

    const token = localStorage.getItem('token');
    if (token) {
      this.userService.checkToken().subscribe({
        next: (response) => {
          if (response && response.user) {
            this.authService.updateUser(response.user);
          }else{
            console.log('Formato no esperado:', response);
            this.handleAuthError();
          }
        },
        error: (error) => {
          console.error('Token check failed:', error);
          //El token es invalido
          this.handleAuthError();
        },
      });
    } else {
      this.handleAuthError();
    }
  }

  private handleAuthError(): void {
    localStorage.removeItem('token');
    this.authService.clearUser();
    this.nombreUsuario = null;
    this.router.navigate(['/login']);
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

  logout():void {
    localStorage.removeItem('token');
    this.authService.clearUser();
    this.nombreUsuario = null;
    this.router.navigate(['/']);
    this.reloadPage();
  }

  reloadPage() {
    window.location.reload();
  }
}
