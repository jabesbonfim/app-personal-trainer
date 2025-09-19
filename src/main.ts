import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { App } from './app.component';

// Import components for routing
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WorkoutTodayComponent } from './components/workouts/workout-today.component';
import { echartsInstance } from './echarts.config';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'workouts', component: WorkoutTodayComponent },
  { path: 'progress', component: DashboardComponent },
  { path: 'students', component: DashboardComponent },
  { path: 'financial', component: DashboardComponent },
  { path: 'chat', component: DashboardComponent },
  { path: '**', redirectTo: '/dashboard' }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      NgxEchartsModule.forRoot({
        echarts: echartsInstance,
      })
    ),
  ]
}).catch(err => console.error(err));
