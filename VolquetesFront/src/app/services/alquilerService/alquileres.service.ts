import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.js';
import { AuthService } from '../authService/auth.service.js';
import { Alquiler } from '../../model/alquiler.interface.js';


@Injectable({
  providedIn: 'root',
})
export class AlquilerService {
  url = environment.apiUrl;

  private alquilerSubject = new BehaviorSubject<Alquiler[]>([]);
  public alquileres$: Observable<Alquiler[]> = this.alquilerSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/users';

  private http = inject(HttpClient); // Use inject() to get HttpClient

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService // Inyecta AuthService aquí
  ) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.getAll().subscribe((usuario) => this.alquilerSubject.next(usuario));
  }

  getAll(): Observable<Alquiler[]> {
    //console.log('getAll called');
    return this.http.get<{ data: Alquiler[] }>(this.apiUrl).pipe(
      // tap((response) => console.log('Response from backend:', response)), // Log completo
      map((response) => response.data || []),
      catchError(this.handleError<Alquiler[]>('getAll', []))
    );
  }

  getTipo(id: number): Observable<Alquiler> {
    return this.http
      .get<Alquiler>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError<Alquiler>('getTipo')));
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

  add(alqui: Alquiler): Observable<Alquiler> {
    return this.http.post<Alquiler>(this.apiUrl, alqui).pipe(
      tap(() => this.loadInitialData()),
      catchError(this.handleError<Alquiler>('add'))
    );
  }

  update(auxUser: Alquiler): Observable<Alquiler> {
    const id = auxUser.id;
    if (!id || isNaN(id)) {
      throw new Error('ID inválido para la actualización del un usuario');
    }
    return this.http.put<Alquiler>(`${this.apiUrl}/${id}`, auxUser).pipe(
      tap(() => this.loadInitialData()), // Refresh list
      catchError(this.handleError<Alquiler>('update'))
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
      this.alquilerSubject.next(auxUser);
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
