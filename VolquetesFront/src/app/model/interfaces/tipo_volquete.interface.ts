export interface TipoVolquete {
  id: number;
  descripcion_tipo_volquete: string;
}
export class TipoVolqueteModel implements TipoVolquete {
  id: number = 0;
  descripcion_tipo_volquete: string = '';
}
