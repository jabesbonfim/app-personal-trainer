import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="app">
      @if (showHeader) {
        <app-header></app-header>
      }
      
      <main class="main-content" [class.full-height]="!showHeader">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      background-color: var(--gray-50);
    }

    .main-content.full-height {
      min-height: 100vh;
    }
  `]
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  showHeader = false;

  ngOnInit(): void {
    // Listen to route changes to determine if header should be shown
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showHeader = this.authService.isAuthenticated() && !this.isLoginRoute(event.url);
      });

    // Initial check
    this.showHeader = this.authService.isAuthenticated() && !this.isLoginRoute(this.router.url);
  }

  private isLoginRoute(url: string): boolean {
    return url === '/login' || url === '/';
  }
}
