import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/authService/auth.service.js';

@Component({
  selector: 'app-second-header',
  standalone: true,
  imports: [],
  templateUrl: './second-header.component.html',
  styleUrl: './second-header.component.css'
})
export class SecondHeaderComponent implements OnInit, OnDestroy{
  
  private authSubscription: Subscription | null = null;
  tipoUsuario:string | null = null;
  
  constructor(
    private authService: AuthService
  ){}

  ngOnInit(): void {
    //Me suscribo a los cambios de Auth
    this.authSubscription = this.authService.authenticatedUserRole$.subscribe(
      (rol) => {
        this.tipoUsuario = rol;
      }
    );
    // this.tipoUsuario = localStorage.getItem('rol')

  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}