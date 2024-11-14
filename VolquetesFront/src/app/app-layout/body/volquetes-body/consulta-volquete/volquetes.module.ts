import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule para usar directivas comunes como ngIf, ngFor
import { ReactiveFormsModule } from '@angular/forms';  // Si estás usando formularios reactivos
import { ListaVolquetesComponent } from './lista-volquetes/lista-volquetes.component';  // Ajusta la ruta según sea necesario

@NgModule({
  declarations: [ListaVolquetesComponent],  // Declara los componentes relacionados con Volquetes
  imports: [
    CommonModule,  // Importa CommonModule para usar directivas comunes
    ReactiveFormsModule  // Importa ReactiveFormsModule si usas formularios reactivos
  ],
  exports: [ListaVolquetesComponent]  // Exporta los componentes para poder usarlos en otros módulos
})
export class VolquetesModule { }
