import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticatedUser = new BehaviorSubject<string | null>(null);
  authenticatedUser$ = this.authenticatedUser.asObservable();

  constructor(private router: Router) {
    this.loadUser(); //Lo primero que hacemos al iniciar el servicio es cargar el usuario
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
  public setUser(nombreUsuario: string) {
    this.authenticatedUser.next(nombreUsuario);
    localStorage.setItem('nombre_usuario', nombreUsuario);
  }

  public clearUser() {
    this.authenticatedUser.next(null);
    localStorage.removeItem('nombre_usuario');
    localStorage.removeItem('token');
  }

  private loadUser() {
    const nombreUsuario = localStorage.getItem('nombre_usuario');
    if (this.isAuthenticated() && nombreUsuario) {
      this.authenticatedUser.next(nombreUsuario);
    }
  }
}
