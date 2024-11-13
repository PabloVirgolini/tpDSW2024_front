import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SecondHeaderComponent } from './second-header/second-header.component.js';
import { HeaderComponent } from './header/header.component.js';
import { FooterComponent } from './footer/footer.component.js';
import { SidebarComponent } from './sidebar/sidebar.component.js';
import { RouterModule } from '@angular/router';
import { ScrollService } from '../services/scrollService/scroll.service.js';
import { AuthService } from '../services/authService/auth.service.js';


@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    SecondHeaderComponent,
    RouterModule,
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
})
export class AppLayoutComponent implements OnDestroy {
  public showFooter = false;
  private scrollSubscription: Subscription;
  isAuthenticated = false;

  private authSubscription: Subscription | null = null;
  nombreUsuario: string | null = null;

  constructor(
    private scrollService: ScrollService,
    private authService: AuthService
  ) {
    this.scrollSubscription = this.scrollService.scrollDirection$.subscribe(
      (event) => {
        this.onScrollDirection(event);
      }
    );
  }

  ngOnDestroy() {
    this.scrollSubscription.unsubscribe();
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authSubscription = this.authService.authenticatedUser$.subscribe(
      (nombre) => {
        this.nombreUsuario = nombre;
      }
    );
  }

  onScrollDirection(event: string) {
    // Handle scroll direction event here
    console.log(`Scroll direction: ${event}`);
    if (event === 'down') {
      this.showFooter = true;
    } else if (event === 'up') {
      this.showFooter = false;
    }
  }
}