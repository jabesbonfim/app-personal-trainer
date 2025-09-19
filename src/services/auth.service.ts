import { Injectable, signal } from '@angular/core';
import { User, Student, Trainer, Admin } from '../types/user.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | undefined>(undefined);
  private isLoadingSignal = signal(false);

  currentUser = this.currentUserSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    // Simulate loading user from storage or API
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSignal.set(JSON.parse(savedUser));
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    this.isLoadingSignal.set(true);
    
    try {
      // Mock authentication - replace with real authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: Student = {
        id: '1',
        name: 'João Silva',
        email: email,
        role: 'student',
        phone: '(11) 99999-9999',
        birthDate: new Date('1990-01-01'),
        createdAt: new Date(),
        trainerId: 'trainer-1',
        currentWeight: 75,
        height: 180,
        bodyFatPercentage: 15,
        membershipStatus: 'active',
        membershipType: 'Premium',
        membershipStartDate: new Date('2024-01-01'),
        membershipEndDate: new Date('2024-12-31'),
        goals: ['Ganho de massa muscular', 'Melhora da resistência'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      };

      this.currentUserSignal.set(mockUser);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  async loginAsTrainer(email: string, password: string): Promise<boolean> {
    this.isLoadingSignal.set(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTrainer: Trainer = {
        id: 'trainer-1',
        name: 'Maria Santos',
        email: email,
        role: 'trainer',
        phone: '(11) 88888-8888',
        birthDate: new Date('1985-05-15'),
        createdAt: new Date(),
        specialties: ['Musculação', 'Treinamento Funcional', 'Nutrição Esportiva'],
        students: ['1', '2', '3'],
        certification: 'CREF 123456-G/SP',
        experience: 8,
        hourlyRate: 120,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6d4c1e2?w=150&h=150&fit=crop&crop=face'
      };

      this.currentUserSignal.set(mockTrainer);
      localStorage.setItem('currentUser', JSON.stringify(mockTrainer));
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  logout(): void {
    this.currentUserSignal.set(undefined);
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  hasRole(role: User['role']): boolean {
    return this.currentUser()?.role === role;
  }

  hasAnyRole(roles: User['role'][]): boolean {
    const userRole = this.currentUser()?.role;
    return userRole ? roles.includes(userRole) : false;
  }
}
