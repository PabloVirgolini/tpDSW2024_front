export interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rol: string;
}
export class UsuarioModel implements Usuario {
  id: number = 0;
  nombre_usuario: string = '';
  email: string ='';
  rol: string='';
}
