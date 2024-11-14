import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';  // Componente principal
import { VolquetesModule } from './app-layout/body/volquetes-body/consulta-volquete/volquetes.module';  // Importa VolquetesModule
import { ReactiveFormsModule } from '@angular/forms';

// Importar el componente ListaVolquetesComponent
import { ListaVolquetesComponent } from './app-layout/body/volquetes-body/consulta-volquete/lista-volquetes/lista-volquetes.component';  // Ruta correcta

@NgModule({
  declarations: [
    AppComponent,  // El componente principal
  ],
  imports: [
    BrowserModule,
    VolquetesModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]  // Componente que se usará al arrancar la app
})
export class AppModule { }
