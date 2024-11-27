import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';  // Importa ReactiveFormsModule aquí
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlquilerModel } from '../../../../model/alquiler.interface';  // Asegúrate de que la ruta es correcta
import { AlquilerService } from '../../../../services/alquilerService/alquileres.service';  // Asegúrate de que la ruta es correcta
import { AlquilerBodyService } from './alquilerBody.service';  // Asegúrate de que la ruta es correcta
import { ClienteModel } from '../../../../model/interfaces/cliente.interface.js';
import { VolqueteModel } from '../../../../model/interfaces/volquete.interface.js';
import { VolqueteService } from '../../../../services/volqueteService/volquete.service.js';
import { ClienteService } from '../../../../services/clienteService/clientes.service.js';

@Component({
  selector: 'app-alquiler',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule, ReactiveFormsModule],  // Importa módulos necesarios
  templateUrl: './alquiler.component.html',
  styleUrls: ['./alquiler.component.css'],
})
export class AlquilerComponent {
  alquileres: AlquilerModel[] = [];
  clientes: ClienteModel[] = [];
  volquetes: VolqueteModel[] = [];
  alquilerForm: FormGroup;
  displayedColumns: string[] = ['volquete', 'cliente', 'fechaDesde', 'fechaHasta', 'fechaHrEntrega', 'fechaHrRetiro', 'estadoAlquiler'];
  columnNames: { [key: string]: string } = {
    volquete: 'Volquete alquilado',
    cliente: 'Cliente',
    fechaDesde: 'Fecha Desde',
    fechaHasta: 'Fecha Hasta',
    fechaHrEntrega: 'Fecha Entrega',
    fechaHrRetiro: 'Fecha Retiro',
    estadoAlquiler: 'Estado',
  };

  alquilerSeleccionado: AlquilerModel | null = null;
  deletingRow: AlquilerModel | null = null;
  editingRow: AlquilerModel | null = null;
  editTemp: AlquilerModel | null = null;

  isAddingNew: boolean = false;
  isEditing: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private alquilerService: AlquilerService,
    private alquilerBodyService: AlquilerBodyService,
    private volqueteService: VolqueteService,
    private clienteService: ClienteService
  ) {
    // Inicializar formulario con validaciones
    this.alquilerForm = this.fb.group({
      volquete: [0, Validators.required],
      cliente: [0, Validators.required],
      fechaDesde: ['', Validators.required],
      fechaHasta: ['', Validators.required],
      fechaHrEntrega: ['', Validators.required],
      fechaHrRetiro: ['', Validators.required],
      estadoAlquiler: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Cargar los alquileres
    this.loadAlquileres();

    this.loadClientes();
    this.loadVolquetes();
    this.alquilerForm = this.fb.group({
      marca: ['', Validators.required],
      fecha_fabricacion: ['', Validators.required],
      fecha_compra: ['', Validators.required],
      tipoVolquete: [0, Validators.required],
    });


  }
  loadClientes(): void {
    this.subscription.add(
      this.clienteService.getAll().subscribe({
        next: (data) => {
          this.clientes = data; // Guarda todos los tipos en el array
        },
        error: (error) => {
          console.error('Error al cargar los clientes', error);
        },
      })
    );
  }

  loadVolquetes(): void {
    this.subscription.add(
      this.volqueteService.getAll().subscribe({
        next: (data) => {
          this.volquetes = data; // Guarda todos los tipos en el array
        },
        error: (error) => {
          console.error('Error al cargar los volquetes', error);
        },
      })
    );
  }


  loadAlquileres(): void {
    this.subscription.add(
      this.alquilerService.alquileres$.subscribe(
        (data) => {
          console.log('Data received:', data);
          this.alquileres = Object.values(data) || [];
        },
        (error) => {
          console.error('Error al cargar los alquileres', error);
        }
      )
    );
  }

  onSeleccionarTipo(alquiler: AlquilerModel): void {
    this.alquilerBodyService.select(alquiler);
    console.log('Alquiler seleccionado:', alquiler);
  }

  // Eliminar un alquiler
  delete(alquiler: AlquilerModel): void {

    this.isAddingNew = false;
    this.isEditing = false;

    this.deletingRow = alquiler;

    console.log('delete called');
    this.subscription.add(
      this.alquilerService.delete(alquiler.id).subscribe({
        next: () => this.loadAlquileres(),
        error: (error) => console.error('Error al eliminar alquiler', error),
      })
    );
  }

  // Iniciar la edición de un alquiler
  startEdit(alquiler: AlquilerModel): void {
    this.editingRow = alquiler;
    this.editTemp = { ...alquiler }; // Guardar los valores originales para la edición
    this.isAddingNew = false;
    this.isEditing = true;
  }

  // Guardar los cambios después de la edición
  saveEdit(): void {
    if (this.alquilerForm.valid && this.editTemp) {
      const editedAlquiler = { ...this.editTemp, ...this.alquilerForm.value };
      this.subscription.add(
        this.alquilerService.update(editedAlquiler).subscribe({
          next: () => {
            this.loadAlquileres();
            this.isEditing = false;
            this.alquilerForm.reset();
          },
          error: (error) => console.error('Error al guardar la edición', error),
        })
      );
    }
  }

  // Cancelar la edición
  cancelEdit(): void {
    this.isAddingNew = false;
    this.isEditing = false;
    this.editingRow = null;
    this.alquilerForm.reset();
  }

  // Agregar un nuevo alquiler
  add(): void {
       // Abrir el formulario para agregar un nuevo volquete
       this.isAddingNew = true;
       this.alquilerForm.reset(); // Limpiar el formulario
       this.alquilerForm.patchValue({ volquete: null, cliente: null });
           if (!this.isAddingNew) {
             // Obtener el ID del Cliente seleccionado desde el formulario
             const clienteIdSeleccionada = Number(this.alquilerForm.get('cliente')?.value);
             // Obtener el ID del Volquete seleccionado desde el formulario
             const volqueteIdSeleccionada = Number(this.alquilerForm.get('volquete')?.value);

             if (clienteIdSeleccionada && volqueteIdSeleccionada ) {
               // Buscar el tipo de volquete completo a partir del ID seleccionado
               const volqueteSeleccionado = this.volquetes.find(
                 (vol) => vol.id === volqueteIdSeleccionada
               );
               const clienteSeleccionado = this.clientes.find(
                (cli) => cli.id === clienteIdSeleccionada
              );

               if (clienteSeleccionado && volqueteSeleccionado) {
                 // Obtener el valor de los campos del formulario
                 const alquilerData: AlquilerModel = {
                   id: this.alquilerForm.get('id')?.value,
                   volquete: volqueteIdSeleccionada,
                   cliente: clienteIdSeleccionada,
                   fechaDesde: this.alquilerForm.get('fechaDesde')?.value,
                   fechaHasta: this.alquilerForm.get('fechaHasta')?.value,
                   fechaHrEntrega: this.alquilerForm.get('fechaHrEntrega')?.value,
                   fechaHrRetiro: this.alquilerForm.get('fechaHrRetiro')?.value,
                   estadoAlquiler: this.alquilerForm.get('estadoAlquiler')?.value,
                  };

                 // Aquí ya puedes enviar el objeto volqueteData al backend
                 this.alquilerService.add(alquilerData).subscribe({
                   next: (response) => {
                     console.log('Alquiler agregado exitosamente', response);
                     this.isAddingNew = false;  // Cerrar el formulario
                     this.alquilerForm.reset(); // Limpiar formulario
                     this.loadAlquileres();      // Recargar lista de volquetes
                   },
                   error: (err) => {
                     console.error('Error al agregar Alquiler', err);
                   },
                 });
               } else {
                 console.error('Volquete o Cliente no encontrado');
               }
             } else {
               console.error('Por favor seleccione un cliente o volquete');
             }
           }
  }

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones al destruir el componente
    this.subscription.unsubscribe();
  }

  // Método para mostrar el formulario en la consola (para debugging)
  onSubmit(): void {
    if (this.alquilerForm.valid) {
      console.log(this.alquilerForm.value);
    }
  }
}
