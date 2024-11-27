
export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  }

export class ClienteModel implements Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;


  constructor(
    id: number = 0,
    nombre: string = '',
    apellido: string = '',
    telefono: string = '',
    direccion: string = '',
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.direccion = direccion;
  }
}
