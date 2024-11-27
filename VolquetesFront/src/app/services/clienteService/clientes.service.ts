import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente, ClienteModel } from '../../model/interfaces/cliente.interface.js';
import { environment } from '../../../environments/environment.js';
import { AuthService } from '../authService/auth.service.js';


@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  url = environment.apiUrl;

  private usuariosSubject = new BehaviorSubject<Cliente[]>([]);
  public usuario$: Observable<Cliente[]> = this.usuariosSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/clientes';

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

  getAll(): Observable<Cliente[]> {
    //console.log('getAll called');
    return this.http.get<{ data: Cliente[] }>(this.apiUrl).pipe(
      // tap((response) => console.log('Response from backend:', response)), // Log completo
      map((response) => response.data || []),
      catchError(this.handleError<Cliente[]>('getAll', []))
    );
  }

  getTipo(id: number): Observable<Cliente> {
    return this.http
      .get<Cliente>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError<Cliente>('getTipo')));
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

  add(auxUser: Cliente): Observable<Cliente> {
    if (!auxUser.nombre) {
      throw new Error('Falta indicar el nombre');
    }
    return this.http.post<Cliente>(this.apiUrl, auxUser).pipe(
      tap(() => this.loadInitialData()), // Refresh list
      catchError(this.handleError<Cliente>('add'))
    );
  }

  update(auxUser: Cliente): Observable<Cliente> {
    const id = auxUser.id;
    if (!id || isNaN(id)) {
      throw new Error('ID inválido para la actualización del un usuario');
    }
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, auxUser).pipe(
      tap(() => this.loadInitialData()), // Refresh list
      catchError(this.handleError<Cliente>('update'))
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




}
