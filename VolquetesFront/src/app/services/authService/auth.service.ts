import { Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatus.asObservable();

  private authenticatedUser = new BehaviorSubject<string | null>(null);
  authenticatedUser$ = this.authenticatedUser.asObservable();

  // BehaviorSubject para el rol. Lo usamos para algunas cuestiones
  private authenticatedUserRole = new BehaviorSubject<string | null>(null);
  authenticatedUserRole$ = this.authenticatedUserRole.asObservable();

  constructor(private router: Router,private http: HttpClient) {
    this.loadUser(); //Lo primero que hacemos al iniciar el servicio es cargar el usuario
  }

  public isAuthenticated(): boolean {
    this.loadUser();
    return this.authStatus.value;
  }

  /*
  public setUser(nombreUsuario: string, token: string) {
    localStorage.setItem('nombre_usuario', nombreUsuario);
    localStorage.setItem('token', token);
    this.authenticatedUser.next(nombreUsuario);
    this.authStatus.next(true);

    this.obtenerRolUsuario(nombreUsuario).subscribe({
      error: (error) => {
        console.error('Error al obtener el rol', error);
        // Manejo de error si no se puede obtener el rol
        this.authenticatedUserRole.next(null);
      }
    });
  }
    */

  public setUser(nombreUsuario: string, token: string) {

    localStorage.setItem('nombre_usuario', nombreUsuario);
    localStorage.setItem('token', token);
    this.authenticatedUser.next(nombreUsuario);
    this.authStatus.next(true);

    this.obtenerRolUsuario(nombreUsuario).subscribe({
      error: (error) => {
        console.error('Error al obtener el rol', error);
        // Manejo de error si no se puede obtener el rol
        this.authenticatedUserRole.next(null);
      }
    });
  }

  public updateUser(user: { nombre_usuario: string }): void {
    if (user && user.nombre_usuario) {
      this.authenticatedUser.next(user.nombre_usuario);
      this.authStatus.next(true);
      localStorage.setItem('nombre_usuario', user.nombre_usuario);

      this.obtenerRolUsuario(user.nombre_usuario).subscribe({
        error: (error) => {
          console.error('Error al obtener el rol', error);
          this.authenticatedUserRole.next(null);
        }
      });

    } else {
      console.error('Invalid user data provided to updateUser');
      this.clearUser();
    }
  }

  public clearUser() {
    this.authenticatedUser.next(null);
    this.authStatus.next(false);
    localStorage.removeItem('nombre_usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('rol');

  }

  private loadUser() {
    const nombreUsuario = localStorage.getItem('nombre_usuario');
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // console.log('loadUser: token =', token, 'nombreUsuario =', nombreUsuario);


    if (token && nombreUsuario) {
      this.authenticatedUser.next(nombreUsuario);
      this.authStatus.next(true);

      if (rol) {
        this.authenticatedUserRole.next(rol);
      } else {
        this.obtenerRolUsuario(nombreUsuario).subscribe({
          error: (error) => {
            console.error('Error al obtener el rol al cargar usuario', error);
            this.authenticatedUserRole.next(null);
          }
        });
      }
    } else {
      this.authStatus.next(false);
    }
  }

  public obtenerRolUsuario(nombreUsuario: string): Observable<{ rol: any }> {
    console.log('Llamando a obtenerRolUsuario con:', nombreUsuario);
    return this.http.get<{ rol: any }>(`/api/users/rol/${nombreUsuario}`).pipe(
      tap(response => {
        console.log('Respuesta del backend:', response);

        let rolUsuario: string | null = null;

        // Mapeo de IDs de rol a nombres
        const rolesMap: { [key: number]: string } = {
          1: 'admin',
          2: 'user',
          3: 'moderator'
        };

        if (response.rol && typeof response.rol === 'object' && 'id' in response.rol) {
          rolUsuario = rolesMap[response.rol.id] || 'unknown'; // Default si no encuentra el rol
        } else if (typeof response.rol === 'string') {
          rolUsuario = response.rol;
        }

        if (rolUsuario && rolUsuario !== 'unknown') {
          console.log('Rol asignado:', rolUsuario);
          this.authenticatedUserRole.next(rolUsuario);
          localStorage.setItem('rol', rolUsuario);
        } else {
          console.warn('El backend devolvió un rol desconocido');
        }
      })
    );
  }



}
