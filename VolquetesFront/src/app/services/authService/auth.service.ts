import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatus.asObservable();

  private authenticatedUser = new BehaviorSubject<string | null>(null);
  authenticatedUser$ = this.authenticatedUser.asObservable();

  constructor(private router: Router) {
    this.loadUser(); //Lo primero que hacemos al iniciar el servicio es cargar el usuario
  }

  public isAuthenticated(): boolean {
    return this.authStatus.value;
  }

  public setUser(nombreUsuario: string, token: string) {
    localStorage.setItem('nombre_usuario', nombreUsuario);
    localStorage.setItem('token', token);
    this.authenticatedUser.next(nombreUsuario);
    this.authStatus.next(true); //emitimos el nombre del usuario arriba y aca true.
  }
  public updateUser(user: any): void {
    if (user && user.nombre) {
      this.authenticatedUser.next(user.nombre);
      this.authStatus.next(true);
      localStorage.setItem('nombre_usuario', user.nombre);
    }
  }
  public clearUser() {
    this.authenticatedUser.next(null);
     this.authStatus.next(false);
    localStorage.removeItem('nombre_usuario');
    localStorage.removeItem('token');
  }

  private loadUser() {
    const nombreUsuario = localStorage.getItem('nombre_usuario');
    const token = localStorage.getItem('token');

    if (token && nombreUsuario) {
      // en realidad acá hay que ir al backend por un checktoken
      this.authenticatedUser.next(nombreUsuario);
      this.authStatus.next(true); //de nuevo, emitimos el nombre del usuario arriba y aca true.
    } else {
      this.authStatus.next(false);
    }
  }
}
