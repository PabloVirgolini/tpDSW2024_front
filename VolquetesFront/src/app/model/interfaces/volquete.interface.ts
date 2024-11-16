import { TipoVolquete, TipoVolqueteModel } from './tipo_volquete.interface.js';


export interface Volquete {
  id: number;
  tipoVolquete: TipoVolquete;
  fecha_compra: Date;
  fecha_fabricacion: Date;
  marca: string;
  }

export class VolqueteModel implements Volquete {
  id: number;
  tipoVolquete:TipoVolqueteModel;
  fecha_compra: Date;
  fecha_fabricacion: Date;
  marca: string;


  constructor(
    id: number = 0,
    fecha_compra: Date = new Date(),
    fecha_fabricacion: Date = new Date(),
    marca: string = '',
    TipoVolquete: TipoVolquete = { id: 0, descripcion_tipo_volquete: '' }
  ) {
    this.id = id;
    this.fecha_compra = fecha_compra;
    this.fecha_fabricacion = fecha_fabricacion;
    this.marca = marca;
    this.tipoVolquete=TipoVolquete;
  }
}
