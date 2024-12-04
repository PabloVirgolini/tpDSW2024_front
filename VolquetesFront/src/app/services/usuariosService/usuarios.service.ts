import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario, UsuarioModel } from '../../model/interfaces/usuario.interface.js';
import { environment } from '../../../environments/environment.js';
import { AuthService } from '../authService/auth.service.js';


@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  url = environment.apiUrl;

  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  public usuario$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/users';

  private http = inject(HttpClient); // Use inject() to get HttpClient

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService // Inyecta AuthService aquí
  ) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.getAll().subscribe((usuario) => this.usuariosSubject.next(usuario));
  }

  getAll(): Observable<Usuario[]> {
    //console.log('getAll called');
    return this.http.get<{ data: Usuario[] }>(this.apiUrl).pipe(
      // tap((response) => console.log('Response from backend:', response)), // Log completo
      map((response) => response.data || []),
      catchError(this.handleError<Usuario[]>('getAll', []))
    );
  }

  getAllPossibleRoles (): Observable<string[]> {
    //console.log('getRolesList called');
    const url = `${this.apiUrl}/getAllPossibleRoles`; //Endpoint del backend
    return this.http.get<{ roles: string[] }>(url).pipe(
      // tap((response) => console.log('Response from backend:', response)), // Log completo
      map((response) => response.roles),
      catchError(this.handleError<string[]>('getAllPossibleRoles', []))
    );
  }

  getTipo(id: number): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError<Usuario>('getTipo')));
  }

  getEmailByUsername(data: { nombreUsuario: string }) {
    return this.http
      .post(`${this.apiUrl}/getEmailByUsername`, data, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .pipe(
        map((response: any) => response), // Mapear la respuesta si necesitas adaptar el formato
        catchError(this.handleError<any>('getEmailByUsername'))
      );
  }

  add(auxUser: Usuario): Observable<Usuario> {
    if (!auxUser.nombre_usuario) {
      throw new Error('Falta indicar el nombre');
    }
    return this.http.post<Usuario>(this.apiUrl, auxUser).pipe(
      tap(() => this.loadInitialData()), // Refresh list
      catchError(this.handleError<Usuario>('add'))
    );
  }

  update(auxUser: UsuarioModel): Observable<UsuarioModel> {
    const id = auxUser.id;
    if (!id || isNaN(id)) {
      throw new Error('ID inválido para la actualización del un usuario');
    }
    return this.http.put<UsuarioModel>(`${this.apiUrl}/${id}`, auxUser).pipe(
      tap(() => this.loadInitialData()), // Refresh list
      catchError(this.handleError<UsuarioModel>('update'))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadInitialData()), // Refresh list
      catchError(this.handleError<void>('delete'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private emitirListadoActualizado() {
    this.getAll().subscribe((auxUser) => {
      this.usuariosSubject.next(auxUser);
    });
  }

  login(data: any) {
    return this.http
      .post(`${this.apiUrl}/login`, data, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .pipe(
        tap((response: any) => {
          console.log("usuarios.service response: ", response)
          if (response.token && response.nombre_usuario) {
            localStorage.setItem('token', response.token);
            this.authService.setUser(response.nombre_usuario, response.token);
          }
        }),
        catchError(this.handleError<any>('login'))
      );
  }

  checkToken(): Observable<{ valid: boolean; user: { nombre_usuario: string } } | null> {
    const token = localStorage.getItem('token');
    
    if(!token){
      console.log("No token");
      return of(null); //devolvemos un valor observable para indicar que no hay token
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = '/api/authentication/checkToken';
    
    return this.http
      .get<{ valid: boolean; user: { nombre_usuario: string } }>(url, {
        headers,
      })
      .pipe(
        map((response) => {
          if (response && response.valid && response.user) {
            return response;
          } else {
            console.error('Unexpected response format', response);
            return null;
          }
        }),
        catchError((error) => {
          console.error('Error in checkToken:', error);
          // Retorna null en caso de error.
          return of(null);
        })
      );
  }

  recoverPassword(data: { email: string }) {
    return this.http
      .post(`${this.apiUrl}/recoverpassword`, data, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .pipe(
        tap((response: any) => {
          if (response.message) {
            console.log(`Recover password success: ${response.message}`);
          }
        }),
        catchError(this.handleError<any>('recoverPassword'))
      );
  }
}
