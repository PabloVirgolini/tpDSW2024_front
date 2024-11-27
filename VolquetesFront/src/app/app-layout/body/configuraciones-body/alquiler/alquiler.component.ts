import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlquilerModel } from '../../../../model/alquiler.interface.js';
import { AlquilerBodyService } from './alquilerBody.service.js';
import { AlquilerService } from '../../../../services/alquilerService/alquileres.service.js';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class AlquilerComponent {
  alquileres: AlquilerModel[] = [];
  displayedColumns: string[] = ['volquete', 'cliente', 'fechaDesde','fechaHasta','fechaHrEntrega','fechaHrRetiro','estadoAlquiler'];
  columnNames: { [key: string]: string } = {
    volquete: 'Volquete alquilado',
    cliente: 'Cliente',
    fechaDesde: 'Fecha Desde',
    fechaHasta: 'Fecha Hasta',
    fechaHrEntrega: 'Fecha Entrega',
    fechaHrRetiro: 'Fecha Retiro',
    estadoAlquiler: 'Estado',
  };

  getColspan(): number {
    return this.displayedColumns.reduce((acc) => acc + 1, 0) + 1;
  }

  alquilerSeleccionado: AlquilerModel | null = null;
  deletingRow: AlquilerModel | null = null;
  editingRow: AlquilerModel | null = null;
  editTemp: AlquilerModel  | null = null;

  isAddingNew: boolean = false;
  isEditing: boolean = false;

  private subscription = new Subscription();

  constructor(
    private alquilerService: AlquilerService,
    private alquilerBodyService: AlquilerBodyService
  ) {

  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadAlquileres();
  }


  loadAlquileres(): void {
    this.subscription.add(
      this.alquilerService.getAll().subscribe({
        next: (data) => {
          this.alquileres = data; // Guarda todos los tipos en el array
        },
        error: (error) => {
          console.error('Error al cargar los tipos de volquete', error);
        },
      })
    );
  }

  onSeleccionarTipo(usuario: AlquilerModel): void {
    this.alquilerBodyService.select(
      usuario
    ); /*Servicio para marcar al tipo como "Selected" */
    console.log('Row clicked:', usuario);
  }

  delete(usuario: AlquilerModel): void {
    console.log('delete called');
    this.subscription.add(
      this.alquilerService.delete(usuario.id).subscribe({
        next: () => this.loadAlquileres(),
        error: (error) => console.error('Error al eliminar usuario', error),
      })
    );
  }

  startEdit(usuario: AlquilerModel): void {
    this.editingRow = usuario;
    this.editTemp = { ...usuario }; // Copia del usuario en edición
    this.isAddingNew = false;
    this.isEditing = true;
  }
/*
  saveEdit(): void {
    if (this.isAddingNew) {
      this.add(this.editTemp);
    } else if (this.isEditing) {
      this.update(this.editTemp);
    }
  }*/

  cancelEdit(): void {
    this.isAddingNew = false;
    this.isEditing = false;
    this.editingRow = null; // Exit edit mode
  }
/*
  onAdd(): void {
    this.editTemp = {
      id: 0,
      volquete: 1,
      cliente: 1,
      fechaDesde: '',
      fechaHasta: '',
      fechaHrEntrega: '',
      fechaHrRetiro: '',
      estadoAlquiler: ''
    };
    this.isAddingNew = true;
  }*/

  add(alqui: AlquilerModel): void {
    this.subscription.add(
      this.alquilerService.add(alqui).subscribe({
        next: () => this.loadAlquileres(),
        error: (error) => console.error('Error al agregar usuario', error),
      })
    );
    this.cancelEdit();
  }

  update(alqui: AlquilerModel): void {
    this.subscription.add(
      this.alquilerService.update(alqui).subscribe({
        next: () => this.loadAlquileres(),
        error: (error) => console.error('Error al actualizar usuario', error),
      })
    );
    this.cancelEdit();
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.subscription.unsubscribe(); // Clean up subscriptions
  }
}
