import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VolqueteModel } from '../../../model/interfaces/volquete.interface.js';

@Injectable({
  providedIn: 'root'
})
export class  VolqueteBodyService {

  private isAddingSubject = new BehaviorSubject<boolean>(false);
  isAdding$ = this.isAddingSubject.asObservable();

  private isEditModeSubject = new BehaviorSubject<boolean>(false);
  isEditMode$ = this.isEditModeSubject.asObservable();

  private selected = new BehaviorSubject<VolqueteModel | null>(null);
  selectedTipoVolquete$ = this.selected.asObservable();

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

  select(tipo: VolqueteModel) {
    this.selected.next(tipo);
  }

  clearSelected() {
    this.selected.next(null);
    this.stopEditing;
  }
}
