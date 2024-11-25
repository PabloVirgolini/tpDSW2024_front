import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VolqueteModel } from '../../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js'
import { Volquete } from '../../../../../../../../VolquetesFront/src/app/model/interfaces/volquete.interface.js';
import {
  ReactiveFormsModule, FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { VolqueteService } from     '../../../../../services/volqueteService/volquete.service.js';
import { TiposVolqueteService } from '../../../../../services/tiposVolqueteService/tipos-volquete.service.js';
import { Observable } from 'rxjs';
import { TipoVolqueteModel } from '../../../../../model/interfaces/tipo_volquete.interface.js';
import { VolqueteBodyService } from '../../volquete-body.service.js';



export class TuModulo { }
@Component({
  selector: 'app-lista-volquetes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lista-volquetes.component.html',
  styleUrl: './lista-volquetes.component.css',
})
export class ListaVolquetesComponent {
  @Input() volquete!: Volquete;
  volqueteForm: FormGroup;
  volquetes: VolqueteModel[] = [];
  displayedColumns: string[] = [
    'id',
    'marca',
    'fecha_fabricacion',
    'fecha_compra',
    'tipoVolquete',
  ];
  tipoVolquetes: TipoVolqueteModel[] = [];
  isAddingNew: boolean = false; // Variable de control para el estado de agregar nuevo
  isEditing: boolean = false; // Variable de control para el estado de editar
  editTemp: VolqueteModel | null = null; // Variable temporal para almacenar los datos de edición
  volqueteSeleccionado: VolqueteModel | null = null;
  deletingRow: VolqueteModel | null = null;
  editingRow: VolqueteModel | null = null;

  getColspan(): number {
    return this.displayedColumns.reduce((acc) => acc + 1, 0) + 1;
  }

  columnNames: { [key: string]: string } = {
    id: 'Nro',
    marca: 'Marca',
    fecha_fabricacion: 'Fecha de Fabricacion',
    fecha_compra: 'Fecha de Compra',
    tipoVolquete: 'Tipo Volquete',
  };

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private volqueteService: VolqueteService,
    private tipoVolqueteService: TiposVolqueteService,
    private VolqueteFormListService: VolqueteBodyService
  ) {
    // Inicializamos el formulario con los controles
    this.volqueteForm = this.fb.group({
      marca: ['', Validators.required], // Marca con validación requerida
      fecha_fabricacion: ['', Validators.required], // Fecha de fabricación
      fecha_compra: ['', Validators.required], // Fecha de compra
      tipoVolquete: ['', Validators.required], // Tipo de volquete con validación
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadVolquetes();
    this.loadTipoVolquetes();
    this.volqueteForm = this.fb.group({
      marca: ['', Validators.required],
      fecha_fabricacion: ['', Validators.required],
      fecha_compra: ['', Validators.required],
      tipoVolquete: ['', Validators.required],
    });
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
          this.volquetes = Object.values(data) || [];
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
/*
  onAdd(): void {
    if (!this.isAddingNew) {
      // Obtener el ID del TipoVolquete seleccionado desde el formulario
      const tipoVolqueteIdSeleccionado =
        this.volqueteForm.get('tipoVolquete')?.value;

      if (tipoVolqueteIdSeleccionado) {
        // Buscar el tipo de volquete completo a partir del ID seleccionado
        const tipoVolqueteSeleccionado = this.tipoVolquetes.find(
          (tipo) => tipo.id === tipoVolqueteIdSeleccionado
        );

        if (tipoVolqueteSeleccionado) {
          this.volqueteService.getMaxId().subscribe({
            next: (maxVolquete: VolqueteModel) => {
              // Crear un nuevo objeto Volquete con el TipoVolquete completo
              const newVolquete: VolqueteModel = {
                id: maxVolquete.id + 1,
                marca: this.volqueteForm.get('marca')?.value,
                fecha_compra: this.volqueteForm.get('fecha_compra')?.value,
                fecha_fabricacion:
                  this.volqueteForm.get('fecha_fabricacion')?.value,
                TipoVolquete: tipoVolqueteSeleccionado, // Asignar el objeto completo
              };
              this.volquetes.push(newVolquete); // Agregar a la lista de volquetes
              this.isAddingNew = false;
              this.volqueteForm.reset(); // Limpiar formulario
              console.log('Agregando nuevo volquete');
            },
            error: (err) => {
              console.error('Error al agregar nuevo volquete', err);
            },
          });
        } else {
          console.error('Tipo de volquete no encontrado');
        }
      } else {
        console.error('Por favor seleccione un tipo de volquete');
      }
    }
  }*/

    onAdd(): void {
        // Abrir el formulario para agregar un nuevo volquete
  this.isAddingNew = true;
  this.volqueteForm.reset(); // Limpiar el formulario
  this.volqueteForm.patchValue({ TipoVolquete: null });
      if (!this.isAddingNew) {
        // Obtener el ID del TipoVolquete seleccionado desde el formulario
        const tipoVolqueteIdSeleccionado = this.volqueteForm.get('TipoVolquete')?.value;

        if (tipoVolqueteIdSeleccionado) {
          // Buscar el tipo de volquete completo a partir del ID seleccionado
          const tipoVolqueteSeleccionado = this.tipoVolquetes.find(
            (tipo) => tipo.id === tipoVolqueteIdSeleccionado
          );

          if (tipoVolqueteSeleccionado) {
            // Obtener el valor de los campos del formulario
            const volqueteData: VolqueteModel = {
              id: this.volqueteForm.get('id')?.value,
              marca: this.volqueteForm.get('marca')?.value,
              fecha_compra: this.volqueteForm.get('fecha_compra')?.value,
              fecha_fabricacion: this.volqueteForm.get('fecha_fabricacion')?.value,
              TipoVolquete: tipoVolqueteSeleccionado, // Asignar el objeto completo de TipoVolquete
            };

            // Aquí ya puedes enviar el objeto volqueteData al backend
            this.volqueteService.add(volqueteData).subscribe({
              next: (response) => {
                console.log('Volquete agregado exitosamente', response);
                this.isAddingNew = false;  // Cerrar el formulario
                this.volqueteForm.reset(); // Limpiar formulario
                this.loadVolquetes();      // Recargar lista de volquetes
              },
              error: (err) => {
                console.error('Error al agregar volquete', err);
              },
            });
          } else {
            console.error('Tipo de volquete no encontrado');
          }
        } else {
          console.error('Por favor seleccione un tipo de volquete');
        }
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

  // Método de edición de un Volquete
  startEdit(volquete: VolqueteModel): void {
    this.isEditing = true;
    this.isAddingNew = false;
    this.editTemp = { ...volquete }; // Guardar el volquete a editar

    // Rellenar el formulario con los datos del volquete
    this.volqueteForm.patchValue({
      marca: volquete.marca,
      fecha_fabricacion: volquete.fecha_fabricacion,
      fecha_compra: volquete.fecha_compra,
      tipoVolquete: volquete.TipoVolquete.id,
    });
  }

  // Guardar cambios de edición
  saveEdit(): void {
    if (this.volqueteForm.valid && this.editTemp) {
      const editedVolquete = { ...this.editTemp, ...this.volqueteForm.value };
      const index = this.volquetes.findIndex((v) => v.id === editedVolquete.id);
      if (index !== -1) {
        this.volquetes[index] = editedVolquete;
      }
      this.isEditing = false;
      this.volqueteForm.reset(); // Limpiar formulario
    }
  }

  // Método para cancelar edición
  cancelEdit(): void {
    this.isEditing = false;
    this.isAddingNew = false;
    this.volqueteForm.reset();
  }

  getTipo(id: number): Observable<TipoVolqueteModel> {
    return this.tipoVolqueteService.getTipo(id);
  }

  onSubmit(): void {
    if (this.volqueteForm.valid) {
      const formValue = this.volqueteForm.value;
      const tipoVolqueteId = formValue.TipoVolquete;

      if (tipoVolqueteId) {
        const tipoVolqueteSeleccionado = this.tipoVolquetes.find(
          (tipo) => tipo.id === tipoVolqueteId
        );

        if (tipoVolqueteSeleccionado) {
          const volqueteToSend: Volquete = {
            id: 0, // Asignar un valor temporal al id, ya que será reemplazado por el backend
            marca: formValue.marca,
            fecha_fabricacion: formValue.fecha_fabricacion,
            fecha_compra: formValue.fecha_compra,
            TipoVolquete: tipoVolqueteSeleccionado,
          };

          // Llamada al servicio para enviar el objeto al backend
          this.volqueteService.add(volqueteToSend).subscribe({
            next: (response) => {
              console.log('Volquete agregado exitosamente:', response);
              this.isAddingNew = false;
              this.volqueteForm.reset();
            },
            error: (err) => {
              console.error('Error al agregar volquete:', err);
            },
          });
        } else {
          console.error('Tipo de volquete no encontrado');
        }
      } else {
        console.error('Por favor seleccione un tipo de volquete');
      }
    } else {
      console.log('Formulario no válido. Por favor complete todos los campos.');
    }
  }



}
