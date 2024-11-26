import {inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Volquete, VolqueteModel} from '../../model/interfaces/volquete.interface.js';
import {TipoVolquete, TipoVolqueteModel} from '../../model/interfaces/tipo_volquete.interface.js';
import { TiposVolqueteService } from '../tiposVolqueteService/tipos-volquete.service.js';

@Injectable({
  providedIn: 'root',
})
export class VolqueteService {
  private volqueteSubject = new BehaviorSubject<Volquete[]>([]);
  public volquetes$: Observable<Volquete[]> =
    this.volqueteSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/volquetes';
  private tipoVolqueteService = inject(TiposVolqueteService);
  private http = inject(HttpClient);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.getAll().subscribe((volquete) => this.volqueteSubject.next(volquete));
  }

  getAll(): Observable<Volquete[]> {
    console.log('getAll called');
    return this.http.get<{ data: Volquete[] }>(this.apiUrl).pipe(
      tap((response) => console.log('Response from backend:', response)), // Log completo
      map((response) => response.data || []),
      catchError(this.handleError<Volquete[]>('getAll', []))
    );
  }
  
  getMaxId(): Observable<Volquete>{
    console.log('getMaxId called');
    return this.getAll().pipe(
     map((volquetes:Volquete[])=>{
         if (!volquetes||volquetes.length===0){
           throw new Error('No hay elementos en la lista');
         }

         const maxVolquete = volquetes.reduce((prev,current)=>
           prev.id > current.id ? prev:current );
         return maxVolquete;
     }),
     catchError(this.handleError<Volquete>('getMaxId'))
   );
 }

 getTipo(id: number): Observable<TipoVolquete> {
  return this.http.get<TipoVolquete>(`${this.apiUrl}/${id}`).pipe(
    catchError(this.handleError<TipoVolquete>('getTipo'))
  );
}


  getVolquete(id: number): Observable<Volquete> {
    return this.http
      .get<Volquete>('${this.apiUrl}/${id}')
      .pipe(catchError(this.handleError<Volquete>('getVolquete')));
  }

  add(volquete: Volquete): Observable<Volquete> {
    return this.http.post<Volquete>(this.apiUrl, volquete).pipe(
      tap(() => this.loadInitialData()),
      catchError(this.handleError<Volquete>('add'))
    );
  }

  update(volquete: VolqueteModel): Observable<VolqueteModel> {
    const nro = volquete.id;
    if (!nro || isNaN(nro)) {
      throw new Error('Nro inválido para la actualización del volquete');
    }
    return this.http.put<VolqueteModel>('${this.apiUrl}/${nro}', volquete).pipe(
      tap(() => this.loadInitialData()),
      catchError(this.handleError<VolqueteModel>('Update'))
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
}
