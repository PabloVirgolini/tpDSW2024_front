import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BurgerMenuComponent } from './burger-button/burger-button.component.js';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuariosService/usuarios.service.js';
import { LoginComponent } from './login/login/login.component.js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, BurgerMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  logoPath = '/assets/logo.svg';
  
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private userService: UsuariosService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.checkToken().subscribe(
        (response: any) => {
          this.router.navigate(['/']);
        },
        (error: any) => {
          console.error('Token check failed:', error);
          // Aquí hay que redirigir al login cuando lo tengamos armado
        }
      );
    }
  }

  loginAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(LoginComponent, dialogConfig);
  }
}
