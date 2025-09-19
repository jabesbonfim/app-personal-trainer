import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Bell, User, LogOut, Settings, Menu } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="header">
      <div class="header-container">
        <div class="header-left">
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
            <lucide-angular [img]="MenuIcon" size="24"></lucide-angular>
          </button>
          
          <div class="logo">
            <h1>FitTracker Pro</h1>
          </div>
        </div>

        <div class="header-center">
          <nav class="nav-menu">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
            <a routerLink="/workouts" routerLinkActive="active" class="nav-link">Treinos</a>
            <a routerLink="/progress" routerLinkActive="active" class="nav-link">Evolução</a>
            @if (currentUser()?.role === 'trainer' || currentUser()?.role === 'admin') {
              <a routerLink="/students" routerLinkActive="active" class="nav-link">Alunos</a>
              <a routerLink="/financial" routerLinkActive="active" class="nav-link">Financeiro</a>
            }
            <a routerLink="/chat" routerLinkActive="active" class="nav-link">IA Trainer</a>
          </nav>
        </div>

        <div class="header-right">
          <button class="notification-btn">
            <lucide-angular [img]="BellIcon" size="20"></lucide-angular>
            <span class="notification-badge">3</span>
          </button>

          <div class="user-menu">
            <button class="user-btn" (click)="toggleUserMenu()">
              @if (currentUser()?.avatar) {
                <img [src]="currentUser()?.avatar" [alt]="currentUser()?.name" class="user-avatar">
              } @else {
                <lucide-angular [img]="UserIcon" size="20"></lucide-angular>
              }
              <span class="user-name">{{ currentUser()?.name }}</span>
            </button>

            @if (showUserMenu) {
              <div class="user-dropdown">
                <div class="user-info">
                  <p class="user-role">{{ getRoleLabel(currentUser()?.role) }}</p>
                  <p class="user-email">{{ currentUser()?.email }}</p>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <button class="dropdown-item" (click)="openSettings()">
                  <lucide-angular [img]="SettingsIcon" size="16"></lucide-angular>
                  Configurações
                </button>
                
                <button class="dropdown-item logout" (click)="logout()">
                  <lucide-angular [img]="LogOutIcon" size="16"></lucide-angular>
                  Sair
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      @if (showMobileMenu) {
        <div class="mobile-nav">
          <a routerLink="/dashboard" class="mobile-nav-link" (click)="closeMobileMenu()">Dashboard</a>
          <a routerLink="/workouts" class="mobile-nav-link" (click)="closeMobileMenu()">Treinos</a>
          <a routerLink="/progress" class="mobile-nav-link" (click)="closeMobileMenu()">Evolução</a>
          @if (currentUser()?.role === 'trainer' || currentUser()?.role === 'admin') {
            <a routerLink="/students" class="mobile-nav-link" (click)="closeMobileMenu()">Alunos</a>
            <a routerLink="/financial" class="mobile-nav-link" (click)="closeMobileMenu()">Financeiro</a>
          }
          <a routerLink="/chat" class="mobile-nav-link" (click)="closeMobileMenu()">IA Trainer</a>
        </div>
      }
    </header>
  `,
  styles: [`
    .header {
      background: white;
      border-bottom: 1px solid var(--gray-200);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      color: var(--gray-600);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--border-radius-md);
    }

    .mobile-menu-btn:hover {
      background-color: var(--gray-100);
    }

    .logo h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-600);
      margin: 0;
    }

    .header-center {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      color: var(--gray-600);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius-md);
      transition: all 0.2s ease-in-out;
    }

    .nav-link:hover,
    .nav-link.active {
      color: var(--primary-600);
      background-color: var(--primary-50);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .notification-btn {
      position: relative;
      background: none;
      border: none;
      color: var(--gray-600);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--border-radius-md);
      transition: background-color 0.2s ease-in-out;
    }

    .notification-btn:hover {
      background-color: var(--gray-100);
    }

    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background-color: var(--error-500);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 9999px;
      min-width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-menu {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--border-radius-md);
      transition: background-color 0.2s ease-in-out;
    }

    .user-btn:hover {
      background-color: var(--gray-100);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-name {
      font-weight: 500;
      color: var(--gray-700);
    }

    .user-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 0.5rem;
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      min-width: 200px;
      z-index: 50;
    }

    .user-info {
      padding: 1rem;
    }

    .user-role {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .user-email {
      font-size: 0.75rem;
      color: var(--gray-500);
      margin: 0.25rem 0 0 0;
    }

    .dropdown-divider {
      height: 1px;
      background-color: var(--gray-200);
      margin: 0.5rem 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      color: var(--gray-700);
      font-size: 0.875rem;
      cursor: pointer;
      text-align: left;
      transition: background-color 0.2s ease-in-out;
    }

    .dropdown-item:hover {
      background-color: var(--gray-50);
    }

    .dropdown-item:first-of-type {
      border-top-left-radius: var(--border-radius-lg);
      border-top-right-radius: var(--border-radius-lg);
    }

    .dropdown-item:last-of-type {
      border-bottom-left-radius: var(--border-radius-lg);
      border-bottom-right-radius: var(--border-radius-lg);
    }

    .dropdown-item.logout {
      color: var(--error-600);
    }

    .dropdown-item.logout:hover {
      background-color: var(--error-50);
    }

    .mobile-nav {
      display: none;
      background: white;
      border-top: 1px solid var(--gray-200);
      padding: 1rem;
    }

    .mobile-nav-link {
      display: block;
      color: var(--gray-600);
      text-decoration: none;
      font-weight: 500;
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius-md);
      margin-bottom: 0.5rem;
      transition: all 0.2s ease-in-out;
    }

    .mobile-nav-link:hover,
    .mobile-nav-link.active {
      color: var(--primary-600);
      background-color: var(--primary-50);
    }

    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: block;
      }

      .header-center {
        display: none;
      }

      .user-name {
        display: none;
      }

      .mobile-nav {
        display: block;
      }
    }
  `]
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  showUserMenu = false;
  showMobileMenu = false;

  // Icons
  BellIcon = Bell;
  UserIcon = User;
  LogOutIcon = LogOut;
  SettingsIcon = Settings;
  MenuIcon = Menu;

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  getRoleLabel(role: string | undefined): string {
    switch (role) {
      case 'student': return 'Aluno';
      case 'trainer': return 'Personal Trainer';
      case 'admin': return 'Administrador';
      default: return '';
    }
  }

  openSettings(): void {
    this.showUserMenu = false;
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
