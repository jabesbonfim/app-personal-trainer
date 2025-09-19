import { Injectable } from '@angular/core';
import { faker } from '@faker-js/faker';
import { BodyMeasurement, Goal } from '../types/progress.types';
import { Payment, FinancialSummary } from '../types/financial.types';
import { Workout, WorkoutSession } from '../types/workout.types';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  generateWeightProgression(months: number = 12): { date: Date; weight: number }[] {
    const data = [];
    const startWeight = 80 + Math.random() * 20;
    const currentDate = new Date();
    
    for (let i = months; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      
      const trend = Math.sin((months - i) / months * Math.PI) * 5;
      const noise = (Math.random() - 0.5) * 2;
      const weight = Number((startWeight + trend + noise).toFixed(1));
      
      data.push({ date, weight });
    }
    
    return data;
  }

  generateIMCData(months: number = 12): { date: Date; imc: number }[] {
    const data = [];
    const height = 1.75; // metros
    const currentDate = new Date();
    
    for (let i = months; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      
      const baseWeight = 75 + Math.sin((months - i) / months * Math.PI) * 3;
      const imc = Number((baseWeight / (height * height)).toFixed(1));
      
      data.push({ date, imc });
    }
    
    return data;
  }

  generateBodyFatData(months: number = 12): { date: Date; percentage: number }[] {
    const data = [];
    const currentDate = new Date();
    
    for (let i = months; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      
      const trend = 20 - (months - i) / months * 5;
      const noise = (Math.random() - 0.5) * 1;
      const percentage = Number(Math.max(8, trend + noise).toFixed(1));
      
      data.push({ date, percentage });
    }
    
    return data;
  }

  generateProgressData(): { target: number; current: number }[] {
    return [
      { target: 100, current: 85 },
      { target: 100, current: 92 },
      { target: 100, current: 78 },
      { target: 100, current: 95 },
      { target: 100, current: 88 }
    ];
  }

  generateRadarData(): { indicator: string; value: number; max: number }[] {
    return [
      { indicator: 'Força', value: 85, max: 100 },
      { indicator: 'Resistência', value: 78, max: 100 },
      { indicator: 'Flexibilidade', value: 65, max: 100 },
      { indicator: 'Coordenação', value: 82, max: 100 },
      { indicator: 'Equilíbrio', value: 75, max: 100 },
      { indicator: 'Velocidade', value: 70, max: 100 }
    ];
  }

  generateExerciseProgressData(): { exercise: string; data: { date: Date; weight: number }[] }[] {
    const exercises = ['Supino Reto', 'Agachamento', 'Levantamento Terra', 'Desenvolvimento'];
    
    return exercises.map(exercise => ({
      exercise,
      data: Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        const baseWeight = 40 + Math.random() * 60;
        const progress = i * 2.5;
        const weight = Number((baseWeight + progress + (Math.random() - 0.5) * 5).toFixed(1));
        
        return { date, weight };
      })
    }));
  }

  generateBodyMeasurements(): { measurement: string; data: { date: Date; value: number }[] }[] {
    const measurements = [
      { name: 'Braço', base: 35, variation: 3 },
      { name: 'Peitoral', base: 95, variation: 5 },
      { name: 'Cintura', base: 80, variation: 8 },
      { name: 'Quadril', base: 95, variation: 4 },
      { name: 'Coxa', base: 55, variation: 3 }
    ];
    
    return measurements.map(({ name, base, variation }) => ({
      measurement: name,
      data: Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i) * 2);
        const trend = (Math.random() - 0.3) * variation;
        const value = Number((base + trend).toFixed(1));
        
        return { date, value };
      })
    }));
  }

  generateWorkoutDistribution(): { type: string; percentage: number; color: string }[] {
    return [
      { type: 'Musculação', percentage: 45, color: '#3b82f6' },
      { type: 'Cardio', percentage: 25, color: '#22c55e' },
      { type: 'Funcional', percentage: 20, color: '#f59e0b' },
      { type: 'Flexibilidade', percentage: 10, color: '#ef4444' }
    ];
  }

  generatePayments(): Payment[] {
    const payments: Payment[] = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const dueDate = new Date(currentDate);
      dueDate.setMonth(dueDate.getMonth() - i);
      
      const isOverdue = Math.random() < 0.1;
      const isPaid = !isOverdue && Math.random() < 0.9;
      
      payments.push({
        id: faker.string.uuid(),
        studentId: faker.string.uuid(),
        amount: 150 + Math.random() * 100,
        dueDate,
        paidDate: isPaid ? new Date(dueDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000) : undefined,
        status: isOverdue ? 'overdue' : isPaid ? 'paid' : 'pending',
        type: 'monthly',
        description: `Mensalidade ${dueDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
        method: isPaid ? ['cash', 'card', 'transfer', 'pix'][Math.floor(Math.random() * 4)] as any : undefined
      });
    }
    
    return payments;
  }

  generateFinancialSummary(): FinancialSummary {
    return {
      totalRevenue: 45000 + Math.random() * 10000,
      pendingPayments: 2500 + Math.random() * 1000,
      overduePayments: 800 + Math.random() * 500,
      totalStudents: 45 + Math.floor(Math.random() * 10),
      activeStudents: 38 + Math.floor(Math.random() * 5),
      monthlyGrowth: 5 + Math.random() * 10,
      averagePaymentDelay: 2 + Math.random() * 3
    };
  }

  generateCashFlowData(months: number = 12): { month: string; income: number; expenses: number }[] {
    const data = [];
    const currentDate = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });
      const baseIncome = 8000 + Math.random() * 4000;
      const baseExpenses = 3000 + Math.random() * 2000;
      
      data.push({
        month,
        income: Number(baseIncome.toFixed(0)),
        expenses: Number(baseExpenses.toFixed(0))
      });
    }
    
    return data;
  }

  generateTodayWorkout(): WorkoutSession {
    const exercises = [
      { name: 'Supino Inclinado', sets: 4, reps: '8-12', category: 'Peitoral' },
      { name: 'Crucifixo', sets: 3, reps: '12-15', category: 'Peitoral' },
      { name: 'Desenvolvimento', sets: 4, reps: '8-10', category: 'Ombros' },
      { name: 'Elevação Lateral', sets: 3, reps: '12-15', category: 'Ombros' },
      { name: 'Tríceps Pulley', sets: 3, reps: '10-12', category: 'Tríceps' }
    ];

    return {
      id: faker.string.uuid(),
      workoutId: faker.string.uuid(),
      studentId: '1',
      scheduledDate: new Date(),
      status: 'scheduled',
      exercises: exercises.map(ex => ({
        exerciseId: faker.string.uuid(),
        sets: Array.from({ length: ex.sets }, () => ({
          reps: typeof ex.reps === 'string' ? 10 : ex.reps,
          weight: 20 + Math.random() * 40,
          completed: false
        })),
        completed: false
      }))
    };
  }

  generateRecentWorkouts(): WorkoutSession[] {
    const workouts = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      workouts.push({
        id: faker.string.uuid(),
        workoutId: faker.string.uuid(),
        studentId: '1',
        scheduledDate: date,
        startTime: new Date(date.getTime() + 9 * 60 * 60 * 1000),
        endTime: new Date(date.getTime() + 10.5 * 60 * 60 * 1000),
        status: 'completed' as const,
        exercises: [],
        rating: 3 + Math.random() * 2,
        feedback: faker.lorem.sentence()
      });
    }
    
    return workouts;
  }
}
