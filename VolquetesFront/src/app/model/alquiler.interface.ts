
export interface Alquiler {
  id: number;
  volquete: number | { id: number;
                       marca: string;
                       fecha_compra: string;
                       fecha_fabricacion: string;
                       TipoVolquete: number |
                          { id: number;
                            descripcion_tipo_volquete: string
                          };
                      };
  cliente: number| { id: number;
                    nombre: string;
                    apellido: string;
                    telefono: string;
                    direccion: number;
                   };
  fechaDesde: Date;
  fechaHasta: Date;
  fechaHrEntrega: Date;
  fechaHrRetiro: Date;
  estadoAlquiler: string;
  }

export class AlquilerModel implements Alquiler {
  id: number;
  volquete: number | { id: number;
                       marca: string;
                       fecha_compra: string;
                       fecha_fabricacion: string;
                       TipoVolquete: number |
                          { id: number;
                            descripcion_tipo_volquete: string
                          };
                      };
  cliente: number| { id: number;
                    nombre: string;
                    apellido: string;
                    telefono: string;
                    direccion: number;
                   };
  fechaDesde: Date;
  fechaHasta: Date;
  fechaHrEntrega: Date;
  fechaHrRetiro: Date;
  estadoAlquiler: string;


  constructor(
    id: number = 0,
    volquete:  number = 0,
    cliente:  number = 0,
    fechaDesde: Date = new Date(),
    fechaHasta: Date = new Date(),
    fechaHrEntrega: Date = new Date(),
    fechaHrRetiro: Date = new Date(),
    estadoAlquiler: string = ''
  ) {
    this.id = id;
    this.volquete = volquete;
    this.cliente = cliente;
    this.fechaDesde = fechaDesde;
    this.fechaHasta=fechaHasta;
    this.fechaHrEntrega=fechaHrEntrega;
    this.fechaHrRetiro=fechaHrRetiro;
    this.estadoAlquiler=estadoAlquiler;
  }
}
