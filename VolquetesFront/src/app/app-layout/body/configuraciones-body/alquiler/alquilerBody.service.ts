import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Alquiler, AlquilerModel } from '../../../../model/alquiler.interface.js';


@Injectable({
  providedIn: 'root'
})
export class AlquilerBodyService {

  private isAddingSubject = new BehaviorSubject<boolean>(false);
  isAdding$ = this.isAddingSubject.asObservable();

  private isEditModeSubject = new BehaviorSubject<boolean>(false);
  isEditMode$ = this.isEditModeSubject.asObservable();

  private selected = new BehaviorSubject<AlquilerModel | null>(null);
  selectedUsuario$ = this.selected.asObservable();
  alquileres$: any;

  startAdding() {
    this.clearSelected();
    this.isAddingSubject.next(true);
  }

  stopAdding() {
    this.isAddingSubject.next(false);
  }

  startEditing() {
    this.isEditModeSubject.next(true);
    this.isAddingSubject.next(false);
  }

  stopEditing() {
    this.isEditModeSubject.next(false);
  }

  select(tipo: AlquilerModel) {
    this.selected.next(tipo);
  }

  clearSelected() {
    this.selected.next(null);
    this.stopEditing;
  }
}
