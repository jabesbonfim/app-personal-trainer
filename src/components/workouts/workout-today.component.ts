import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Play, Check, Clock, Target, Weight } from 'lucide-angular';
import { MockDataService } from '../../services/mock-data.service';
import { WorkoutSession } from '../../types/workout.types';

@Component({
  selector: 'app-workout-today',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="workout-today">
      <div class="workout-header">
        <div class="workout-info">
          <h1>Treino de Hoje</h1>
          <p>{{ currentDate | date:'fullDate':'':'pt-BR' }}</p>
        </div>
        
        @if (!workoutStarted()) {
          <button class="btn btn-primary btn-lg" (click)="startWorkout()">
            <lucide-angular [img]="PlayIcon" size="20"></lucide-angular>
            Iniciar Treino
          </button>
        } @else {
          <div class="workout-timer">
            <lucide-angular [img]="ClockIcon" size="20"></lucide-angular>
            {{ formatTime(elapsedTime()) }}
          </div>
        }
      </div>

      @if (todayWorkout) {
        <div class="workout-content">
          <div class="workout-overview">
            <div class="overview-card">
              <lucide-angular [img]="TargetIcon" size="24"></lucide-angular>
              <div>
                <h3>{{ todayWorkout.exercises.length }}</h3>
                <p>Exercícios</p>
              </div>
            </div>
            
            <div class="overview-card">
              <lucide-angular [img]="WeightIcon" size="24"></lucide-angular>
              <div>
                <h3>{{ completedExercises() }}</h3>
                <p>Concluídos</p>
              </div>
            </div>
            
            <div class="overview-card">
              <lucide-angular [img]="ClockIcon" size="24"></lucide-angular>
              <div>
                <h3>~60min</h3>
                <p>Duração</p>
              </div>
            </div>
          </div>

          <div class="exercises-list">
            @for (exercise of exercises; track exercise.id; let i = $index) {
              <div class="exercise-card" [class.completed]="exercise.completed" [class.active]="currentExercise() === i">
                <div class="exercise-header">
                  <div class="exercise-info">
                    <h3>{{ exercise.name }}</h3>
                    <p class="exercise-category">{{ exercise.category }}</p>
                  </div>
                  
                  <button 
                    class="complete-btn"
                    [class.completed]="exercise.completed"
                    (click)="toggleExerciseComplete(i)"
                    [disabled]="!workoutStarted()"
                  >
                    <lucide-angular [img]="CheckIcon" size="16"></lucide-angular>
                  </button>
                </div>

                <div class="exercise-details">
                  <div class="sets-grid">
                    @for (set of exercise.sets; track $index; let setIndex = $index) {
                      <div class="set-item" [class.completed]="set.completed">
                        <div class="set-number">{{ setIndex + 1 }}</div>
                        <div class="set-details">
                          <span>{{ set.reps }} reps</span>
                          <span>{{ set.weight }}kg</span>
                        </div>
                        <button 
                          class="set-complete-btn"
                          [class.completed]="set.completed"
                          (click)="toggleSetComplete(i, setIndex)"
                          [disabled]="!workoutStarted()"
                        >
                          <lucide-angular [img]="CheckIcon" size="12"></lucide-angular>
                        </button>
                      </div>
                    }
                  </div>
                </div>

                @if (exercise.notes) {
                  <div class="exercise-notes">
                    <p>{{ exercise.notes }}</p>
                  </div>
                }
              </div>
            }
          </div>

          @if (workoutStarted()) {
            <div class="workout-actions">
              <button class="btn btn-secondary" (click)="pauseWorkout()">
                Pausar Treino
              </button>
              
              <button 
                class="btn btn-success"
                (click)="completeWorkout()"
                [disabled]="completedExercises() === 0"
              >
                Finalizar Treino
              </button>
            </div>
          }
        </div>
      } @else {
        <div class="no-workout">
          <div class="no-workout-content">
            <h3>Nenhum treino agendado para hoje</h3>
            <p>Que tal dar uma olhada nos treinos disponíveis?</p>
            <button class="btn btn-primary">Ver Treinos</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .workout-today {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .workout-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--gray-200);
    }

    .workout-info h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0 0 0.5rem 0;
    }

    .workout-info p {
      color: var(--gray-600);
      font-size: 1rem;
      margin: 0;
    }

    .workout-timer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: var(--success-50);
      color: var(--success-600);
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius-lg);
      font-weight: 600;
      font-size: 1.125rem;
    }

    .workout-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .overview-card {
      background: white;
      border-radius: var(--border-radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--gray-200);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .overview-card lucide-angular {
      color: var(--primary-500);
    }

    .overview-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0;
    }

    .overview-card p {
      color: var(--gray-600);
      font-size: 0.875rem;
      margin: 0;
    }

    .exercises-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .exercise-card {
      background: white;
      border-radius: var(--border-radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--gray-200);
      transition: all 0.2s ease-in-out;
    }

    .exercise-card.active {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .exercise-card.completed {
      opacity: 0.7;
      background-color: var(--success-50);
    }

    .exercise-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .exercise-info h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 0.25rem 0;
    }

    .exercise-category {
      font-size: 0.875rem;
      color: var(--gray-600);
      margin: 0;
    }

    .complete-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--gray-300);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .complete-btn:hover {
      border-color: var(--success-500);
      background-color: var(--success-50);
    }

    .complete-btn.completed {
      border-color: var(--success-500);
      background-color: var(--success-500);
      color: white;
    }

    .complete-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .sets-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .set-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border: 1px solid var(--gray-200);
      border-radius: var(--border-radius-md);
      background: var(--gray-50);
      transition: all 0.2s ease-in-out;
    }

    .set-item.completed {
      background-color: var(--success-50);
      border-color: var(--success-200);
    }

    .set-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: var(--primary-500);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .set-details {
      display: flex;
      gap: 1rem;
      flex: 1;
    }

    .set-details span {
      font-size: 0.875rem;
      color: var(--gray-700);
      font-weight: 500;
    }

    .set-complete-btn {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid var(--gray-400);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .set-complete-btn:hover {
      border-color: var(--success-500);
      background-color: var(--success-50);
    }

    .set-complete-btn.completed {
      border-color: var(--success-500);
      background-color: var(--success-500);
      color: white;
    }

    .set-complete-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .exercise-notes {
      margin-top: 1rem;
      padding: 1rem;
      background-color: var(--gray-50);
      border-radius: var(--border-radius-md);
      border-left: 4px solid var(--primary-500);
    }

    .exercise-notes p {
      color: var(--gray-700);
      font-size: 0.875rem;
      margin: 0;
    }

    .workout-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      padding-top: 2rem;
      border-top: 1px solid var(--gray-200);
    }

    .no-workout {
      background: white;
      border-radius: var(--border-radius-lg);
      padding: 3rem;
      text-align: center;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--gray-200);
    }

    .no-workout-content h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 1rem 0;
    }

    .no-workout-content p {
      color: var(--gray-600);
      margin: 0 0 2rem 0;
    }

    @media (max-width: 768px) {
      .workout-today {
        padding: 1rem;
      }

      .workout-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .workout-overview {
        grid-template-columns: 1fr;
      }

      .workout-actions {
        flex-direction: column;
      }

      .sets-grid {
        gap: 0.5rem;
      }

      .set-item {
        padding: 0.5rem;
      }

      .set-details {
        gap: 0.5rem;
      }
    }
  `]
})
export class WorkoutTodayComponent implements OnInit {
  private mockDataService = inject(MockDataService);

  currentDate = new Date();
  todayWorkout: WorkoutSession | undefined;
  workoutStarted = signal(false);
  currentExercise = signal(0);
  elapsedTime = signal(0);
  private timer: any;

  // Icons
  PlayIcon = Play;
  CheckIcon = Check;
  ClockIcon = Clock;
  TargetIcon = Target;
  WeightIcon = Weight;

  exercises = [
    {
      id: '1',
      name: 'Supino Inclinado',
      category: 'Peitoral',
      sets: [
        { reps: 12, weight: 60, completed: false },
        { reps: 10, weight: 65, completed: false },
        { reps: 8, weight: 70, completed: false },
        { reps: 8, weight: 70, completed: false }
      ],
      completed: false,
      notes: 'Manter controle na descida. Pausa de 2 segundos no peito.'
    },
    {
      id: '2',
      name: 'Crucifixo com Halteres',
      category: 'Peitoral',
      sets: [
        { reps: 15, weight: 20, completed: false },
        { reps: 12, weight: 22, completed: false },
        { reps: 10, weight: 25, completed: false }
      ],
      completed: false
    },
    {
      id: '3',
      name: 'Desenvolvimento com Halteres',
      category: 'Ombros',
      sets: [
        { reps: 12, weight: 15, completed: false },
        { reps: 10, weight: 17, completed: false },
        { reps: 8, weight: 20, completed: false },
        { reps: 8, weight: 20, completed: false }
      ],
      completed: false
    },
    {
      id: '4',
      name: 'Elevação Lateral',
      category: 'Ombros',
      sets: [
        { reps: 15, weight: 8, completed: false },
        { reps: 12, weight: 10, completed: false },
        { reps: 10, weight: 12, completed: false }
      ],
      completed: false
    },
    {
      id: '5',
      name: 'Tríceps Pulley',
      category: 'Tríceps',
      sets: [
        { reps: 15, weight: 25, completed: false },
        { reps: 12, weight: 30, completed: false },
        { reps: 10, weight: 35, completed: false }
      ],
      completed: false
    }
  ];

  ngOnInit(): void {
    this.todayWorkout = this.mockDataService.generateTodayWorkout();
  }

  startWorkout(): void {
    this.workoutStarted.set(true);
    this.startTimer();
  }

  pauseWorkout(): void {
    this.workoutStarted.set(false);
    this.stopTimer();
  }

  completeWorkout(): void {
    this.workoutStarted.set(false);
    this.stopTimer();
    
    // Here you would typically save the workout data
    console.log('Treino finalizado!', {
      exercises: this.exercises,
      duration: this.elapsedTime(),
      completedExercises: this.completedExercises()
    });
    
    // Show success message or navigate to feedback page
    alert('Treino finalizado com sucesso! 🎉');
  }

  toggleExerciseComplete(exerciseIndex: number): void {
    this.exercises[exerciseIndex].completed = !this.exercises[exerciseIndex].completed;
    
    if (this.exercises[exerciseIndex].completed) {
      // Mark all sets as completed
      this.exercises[exerciseIndex].sets.forEach(set => set.completed = true);
    } else {
      // Mark all sets as incomplete
      this.exercises[exerciseIndex].sets.forEach(set => set.completed = false);
    }
  }

  toggleSetComplete(exerciseIndex: number, setIndex: number): void {
    const set = this.exercises[exerciseIndex].sets[setIndex];
    set.completed = !set.completed;
    
    // Check if all sets are completed
    const allSetsCompleted = this.exercises[exerciseIndex].sets.every(s => s.completed);
    this.exercises[exerciseIndex].completed = allSetsCompleted;
  }

  completedExercises(): number {
    return this.exercises.filter(ex => ex.completed).length;
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.elapsedTime.set(this.elapsedTime() + 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
