export interface Usuario {
  id: number;
  nombre_usuario: string;
  password: string;
  email: string;
  rol: { id: number, descripcion: string };
}
export interface UsuarioModel {
  id: number;
  nombre_usuario: string;
  password: string;
  email: string;
  rol: { id: number, descripcion: string }; // Cambiar rol a un objeto con id y descripcion
}

