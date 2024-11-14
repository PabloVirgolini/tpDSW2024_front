import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolqueteModel } from '../../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js'
import { Volquete } from '../../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VolqueteService } from     '../../../../../services/volqueteService/volquete.service.js';
import { TiposVolqueteService } from '../../../../../services/tiposVolqueteService/tipos-volquete.service.js';
import { Observable } from 'rxjs';
import { TipoVolqueteModel } from '../../../../../model/interfaces/tipo_volquete.interface.js';
import { VolqueteBodyService } from '../../volquete-body.service.js';


@Component({
  selector: 'app-lista-volquetes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-volquetes.component.html',
  styleUrl: './lista-volquetes.component.css',
})
export class ListaVolquetesComponent {
  @Input() volquete!: Volquete;

  volquetes: VolqueteModel[] = [];
  tipoVolquetes: TipoVolqueteModel[] = [];
  displayedColumns: string[] = [
    'id',
    'marca',
    'fecha_fabricacion',
    'fecha_compra',
    'TipoVolquete',
  ];

  getColspan(): number {
    return this.displayedColumns.reduce((acc) => acc + 1, 0) + 1;
  }

  columnNames: { [key: string]: string } = {
    id: 'Nro',
    marca: 'Marca',
    fecha_fabricacion: 'Fecha de Fabricacion',
    fecha_compra: 'Fecha de Compra',
    TipoVolquete: 'Tipo Volquete',
  };

  volqueteSeleccionado: VolqueteModel | null = null;
  deletingRow: VolqueteModel | null = null;
  editingRow: VolqueteModel | null = null;
  editTemp: VolqueteModel | null = null;

  isAddingNew: boolean = false;
  isEditing: boolean = false;

  private subscription = new Subscription();

  constructor(
    private volqueteService: VolqueteService,
    private tipoVolqueteService: TiposVolqueteService,
    private VolqueteFormListService: VolqueteBodyService,

  ) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadVolquetes();
    this.loadTipoVolquetes();
  }

  loadTipoVolquetes(): void {
    this.subscription.add(
      this.tipoVolqueteService.getAll().subscribe({
        next: (data) => {
          this.tipoVolquetes = data; // Guarda todos los tipos en el array
        },
        error: (error) => {
          console.error('Error al cargar los tipos de volquete', error);
        },
      })
    );
  }
  loadVolquetes(): void {
    this.subscription.add(
      this.volqueteService.volquetes$.subscribe(
        (data) => {
          console.log('Data received:', data);
          this.volquetes = Object.values(data);
        },
        (error) => {
          console.error('Error al cargar los volquetes', error);
        }
      )
    );
  }

  delete(volquete: VolqueteModel): void {
    console.log('delete called');

    this.isAddingNew = false;
    this.isEditing = false;

    this.deletingRow = volquete;

    this.subscription.add(
      this.volqueteService.delete(this.deletingRow.id).subscribe({
        next: () => {
          this.loadVolquetes(); // Refresh the list
        },
        error: (error) => {
          console.error('Error al eliminar el tipo de volquete', error);
        },
      })
    );
  }





  onAdd(): void {
    if (!this.isAddingNew) {
      this.volqueteService.getMaxId().subscribe({
        next: (maxVolquete: VolqueteModel) => {
          // Crear un nuevo objeto basado en el maximo ID encontrado
          const newVolquete: VolqueteModel = {
            id: maxVolquete.id+1,
            marca: '',
            fecha_compra: new Date(),
            fecha_fabricacion: new Date(),
            TipoVolquete: 0,
          };
          // Agregar el nuevo objeto al array de tipos
          this.volquetes.push(newVolquete);
          // Iniciar la edición del nuevo objeto
          this.startEdit(newVolquete);
          this.isAddingNew = true;
          this.VolqueteFormListService.startAdding();
          console.log(
            'you pressed onAddProveedor in tiposVolquete-list.component'
          );
        },
        error: (err) => {
          console.error(
            'Error al obtener el TipoVolquete con el ID máximo',
            err
          );
        },
      });
    }
  }





  addVolquete(tipo: VolqueteModel): void {
    this.subscription.add(
      this.volqueteService.add(tipo).subscribe({
        next: (newTipo) => {
          this.loadVolquetes();
        },
        error: (error) => {
          console.error('Error al agregar Volquete:', error);
        },
      })
    );
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.subscription.unsubscribe(); // Clean up subscriptions
  }

  onSeleccionarTipo(tipo: VolqueteModel): void {
    //this.tiposVolqueteFormListService.select(
    tipo;
    // ); /*Servicio para marcar al tipo como "Selected" */
    console.log('Row clicked:', tipo);
  }

  startEdit(tipo: VolqueteModel): void {
    console.log('StartEdit called');

    this.isAddingNew = false;
    this.isEditing = true;

    this.editingRow = tipo;
    this.editTemp = { ...tipo }; // Hago una copia de lo que estamos editando
  }

  saveEdit(): void {
    if (this.editTemp) {
      if (this.isAddingNew) {
        // Si estamos en modo "Agregar"
        this.addVolquete(this.editTemp);
        this.isAddingNew = false; // Salir del modo "Agregar"
      } else if (this.isEditing) {
        // Modo "Editar"
        this.subscription.add(
          this.volqueteService.update(this.editTemp).subscribe({
            next: () => {
              this.loadVolquetes(); // Refrescar la lista
              this.editingRow = null; // Salir del modo "Editar"
              this.isEditing = false; // Cerrar el modal
            },
            error: (error) => {
              console.error('Error al actualizar el volquete', error);
            },
          })
        );
      }
      this.editTemp = null; // Limpiar el objeto temporal de edición
    }
  }

  cancelEdit(): void {
    this.isAddingNew = false;
    this.isEditing = false;
    this.editingRow = null; // Exit edit mode
    this.editTemp = null; // Limpiar el objeto temporal de edición
  }

  getTipo(id: number): Observable<TipoVolqueteModel> {
    return this.tipoVolqueteService.getTipo(id);
  }
}
