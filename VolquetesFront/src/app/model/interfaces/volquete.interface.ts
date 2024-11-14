import { TipoVolquete } from './tipo_volquete.interface';

export interface Volquete {
  id: number;
  marca: string;
  fecha_compra: Date;
  fecha_fabricacion: Date;
  TipoVolquete: TipoVolquete;
  }

export class VolqueteModel implements Volquete {
  id: number;
  marca: string;
  fecha_compra: Date;
  fecha_fabricacion: Date;
  TipoVolquete: TipoVolquete;


  constructor(
    id: number = 0,
    marca: string = '',
    fecha_compra: Date = new Date(),
    fecha_fabricacion: Date = new Date(),
    TipoVolquete: TipoVolquete = { id: 0, descripcion_tipo_volquete: '' }
  ) {
    this.id = id;
    this.marca = marca;
    this.fecha_compra = fecha_compra;
    this.fecha_fabricacion = fecha_fabricacion;
    this.TipoVolquete=TipoVolquete;
  }
}
