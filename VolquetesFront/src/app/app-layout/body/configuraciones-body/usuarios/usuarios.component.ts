import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario, UsuarioModel } from '../../../../model/interfaces/usuario.interface.js';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../../../services/usuariosService/usuarios.service.js';
import { UsuariosBodyService } from './usuariosBody.service.js';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  usuarios: UsuarioModel[] = [];
  displayedColumns: string[] = ['nombre_usuario', 'email', 'rol'];
  columnNames: { [key: string]: string } = {
    nombre_usuario: 'Nombre Usuario',
    email: 'Email',
    rol: 'Nivel Permisos',
  };

  getColspan(): number {
    return this.displayedColumns.reduce((acc) => acc + 1, 0) + 1;
  }

  usuarioSeleccionado: UsuarioModel | null = null;
  deletingRow: UsuarioModel | null = null;
  editingRow: UsuarioModel | null = null;
  editTemp: UsuarioModel = {
    id: 0,
    nombre_usuario: '',
    password: '',
    email: '',
    rol: '',
  };

  listadoRoles = ['Admin','Usuario'];

  isAddingNew: boolean = false;
  isEditing: boolean = false;

  private subscription = new Subscription();

  constructor(
    private usuariosBodyService: UsuariosBodyService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.subscription.add(
      this.usuariosService.usuario$.subscribe(
        (data) => {
          console.log('Data received:', data);
          this.usuarios = Object.values(data);
        },
        (error) => {
          console.error('Error al cargar los usuarios', error);
        }
      )
    );
  }

  onSeleccionarTipo(usuario: UsuarioModel): void {
    this.usuariosBodyService.select(
      usuario
    ); /*Servicio para marcar al tipo como "Selected" */
    console.log('Row clicked:', usuario);
  }

  delete(usuario: UsuarioModel): void {
    console.log('delete called');
    this.subscription.add(
      this.usuariosService.delete(usuario.id).subscribe({
        next: () => this.loadUsuarios(),
        error: (error) => console.error('Error al eliminar usuario', error),
      })
    );
  }

  startEdit(usuario: UsuarioModel): void {
    this.editingRow = usuario;
    this.editTemp = { ...usuario }; // Copia del usuario en edición
    this.isAddingNew = false;
    this.isEditing = true;
  }

  saveEdit(): void {
    if (this.isAddingNew) {
      this.addUsuario(this.editTemp);
    } else if (this.isEditing) {
      this.updateUsuario(this.editTemp);
    }
  }

  cancelEdit(): void {
    this.isAddingNew = false;
    this.isEditing = false;
    this.editingRow = null; // Exit edit mode
  }

  onAdd(): void {
    this.editTemp = {
      id: 0,
      nombre_usuario: '',
      password: '',
      email: '',
      rol: '',
    };
    this.isAddingNew = true;
  }

  addUsuario(usuario: UsuarioModel): void {
    this.subscription.add(
      this.usuariosService.add(usuario).subscribe({
        next: () => this.loadUsuarios(),
        error: (error) => console.error('Error al agregar usuario', error),
      })
    );
    this.cancelEdit();
  }

  updateUsuario(usuario: UsuarioModel): void {
    this.subscription.add(
      this.usuariosService.update(usuario).subscribe({
        next: () => this.loadUsuarios(),
        error: (error) => console.error('Error al actualizar usuario', error),
      })
    );
    this.cancelEdit();
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.subscription.unsubscribe(); // Clean up subscriptions
  }
}
