import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { UsuariosService } from '../../../../services/usuariosService/usuarios.service.js';
import { GlobalConstants } from '../../../../../shared/global-constants.js';
import { SnackbarService } from '../../../../services/snackbarService/snackbar.service.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../services/authService/auth.service.js';
import {Observer} from 'rxjs';

@Component({
  standalone:true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UsuariosService,
    public dialogRef: MatDialogRef<LoginComponent>,
    public ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService, 
    private authService: AuthService
  ) {    this.loginForm = this.formBuilder.group({
    nombreUsuario: [null, [Validators.required]],
    password: [null, Validators.required],
  });
  this.responseMessage = '';
}

  ngOnInit(): void {
  }
  
  reloadPage(){
    window.location.reload();
  }

  handleSubmit() {
    this.ngxService.start();

    var formData = this.loginForm.value;
    var data = {
      nombre_usuario: formData.nombreUsuario,
      password: formData.password,
    };

    //Primero definimos el Observer completo y después nos suscribimos.
    const observer: Observer<any>={
      next:(response)=>{
          this.ngxService.stop();
          this.dialogRef.close();
           // En el service esto hace que se emita un cambio (next) que debería ser escuchado y actualizar la pagina
          //localStorage.setItem('token', response.token); --> esto lo hace el authService.setUser
          this.authService.setUser(formData.nombreUsuario, response.token);
          this.router.navigate(['/']);
          this.reloadPage();
        },
        error: (error) => {
          this.ngxService.stop();
          this.responseMessage = error.error?.message || GlobalConstants.genericError;
          this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        },
        complete: ()=>console.log('Login request completed'),
    };
    
    // Finalmente se llama al método LOGIN del servicio USUARIOSSERVICE para
    // enviar la solicitud de incio de sesión con los datos del formulario.
    this.userService.login(data).subscribe(observer);

    //En caso de éxito se dispara por NEXT.
    // Para la animación de carga, cierra el cuadro de diálogo, guarda el token
    // recibido en el localStorage para futuras solicitudes, y dirige al usuario
    // a la página principal "(/)"
  }
}
