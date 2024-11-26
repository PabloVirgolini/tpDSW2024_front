
export interface Volquete {
  id: number;
  marca: string;
  fecha_compra: Date;
  fecha_fabricacion: Date;
  TipoVolquete: number;
  }

export class VolqueteModel implements Volquete {
  id: number;
  marca: string;
  fecha_compra: Date;
  fecha_fabricacion: Date;
  TipoVolquete: number;


  constructor(
    id: number = 0,
    marca: string = '',
    fecha_compra: Date = new Date(),
    fecha_fabricacion: Date = new Date(),
    TipoVolquete: number = 0
  ) {
    this.id = id;
    this.marca = marca;
    this.fecha_compra = fecha_compra;
    this.fecha_fabricacion = fecha_fabricacion;
    this.TipoVolquete=TipoVolquete;
  }
}
