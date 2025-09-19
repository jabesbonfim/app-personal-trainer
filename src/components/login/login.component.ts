import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, User, Lock } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>FitTracker Pro</h1>
          <p>Sistema de gestão para personal trainers</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">
              <lucide-angular [img]="UserIcon" size="16"></lucide-angular>
              E-mail
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-input"
              placeholder="seu@email.com"
              autocomplete="email"
            >
            @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors) {
              <div class="form-error">E-mail é obrigatório</div>
            }
          </div>

          <div class="form-group">
            <label for="password" class="form-label">
              <lucide-angular [img]="LockIcon" size="16"></lucide-angular>
              Senha
            </label>
            <div class="password-input">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                class="form-input"
                placeholder="Digite sua senha"
                autocomplete="current-password"
              >
              <button
                type="button"
                class="password-toggle"
                (click)="togglePassword()"
                [attr.aria-label]="showPassword() ? 'Ocultar senha' : 'Mostrar senha'"
              >
                <lucide-angular [img]="showPassword() ? EyeOffIcon : EyeIcon" size="16"></lucide-angular>
              </button>
            </div>
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors) {
              <div class="form-error">Senha é obrigatória</div>
            }
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberMe">
              <span class="checkbox-text">Lembrar de mim</span>
            </label>
          </div>

          @if (errorMessage()) {
            <div class="error-message">
              {{ errorMessage() }}
            </div>
          }

          <button
            type="submit"
            class="btn btn-primary btn-lg w-full"
            [disabled]="loginForm.invalid || isLoading()"
          >
            @if (isLoading()) {
              <div class="spinner"></div>
              Entrando...
            } @else {
              Entrar
            }
          </button>
        </form>

        <div class="demo-section">
          <div class="demo-divider">
            <span>ou teste com</span>
          </div>
          
          <div class="demo-buttons">
            <button
              type="button"
              class="btn btn-secondary w-full"
              (click)="loginAsStudent()"
              [disabled]="isLoading()"
            >
              Login como Aluno
            </button>
            
            <button
              type="button"
              class="btn btn-secondary w-full"
              (click)="loginAsTrainer()"
              [disabled]="isLoading()"
            >
              Login como Trainer
            </button>
          </div>
        </div>

        <div class="login-footer">
          <a href="#" class="forgot-password">Esqueceu sua senha?</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-lg);
      padding: 2rem;
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-600);
      margin-bottom: 0.5rem;
    }

    .login-header p {
      color: var(--gray-600);
      font-size: 0.875rem;
    }

    .login-form {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--gray-700);
    }

    .password-input {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--gray-400);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: var(--border-radius-sm);
    }

    .password-toggle:hover {
      color: var(--gray-600);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--gray-600);
    }

    .checkbox-label input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      accent-color: var(--primary-500);
    }

    .error-message {
      background-color: var(--error-50);
      color: var(--error-600);
      padding: 0.75rem;
      border-radius: var(--border-radius-md);
      font-size: 0.875rem;
      margin-bottom: 1rem;
      border: 1px solid var(--error-200);
    }

    .form-error {
      color: var(--error-500);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .demo-section {
      margin: 1.5rem 0;
    }

    .demo-divider {
      position: relative;
      text-align: center;
      margin-bottom: 1rem;
    }

    .demo-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background-color: var(--gray-200);
    }

    .demo-divider span {
      background: white;
      color: var(--gray-500);
      font-size: 0.875rem;
      padding: 0 1rem;
    }

    .demo-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .login-footer {
      text-align: center;
      margin-top: 1.5rem;
    }

    .forgot-password {
      color: var(--primary-600);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .forgot-password:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 1.5rem;
      }
      
      .login-header h1 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = signal(false);
  errorMessage = signal('');
  isLoading = this.authService.isLoading;

  // Icons
  UserIcon = User;
  LockIcon = Lock;
  EyeIcon = Eye;
  EyeOffIcon = EyeOff;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      try {
        this.errorMessage.set('');
        const success = await this.authService.login(email!, password!);
        
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Email ou senha incorretos');
        }
      } catch (error) {
        this.errorMessage.set('Erro ao fazer login. Tente novamente.');
      }
    }
  }

  async loginAsStudent(): Promise<void> {
    this.errorMessage.set('');
    const success = await this.authService.login('aluno@fittracker.com', 'demo123');
    
    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }

  async loginAsTrainer(): Promise<void> {
    this.errorMessage.set('');
    const success = await this.authService.loginAsTrainer('trainer@fittracker.com', 'demo123');
    
    if (success) {
      this.router.navigate(['/dashboard']);
    }
  }
}
