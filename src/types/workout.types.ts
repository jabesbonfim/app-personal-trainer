export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment?: string;
  instructions?: string;
  imageUrl?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise?: Exercise;
  sets: number;
  reps: number | string;
  weight?: number;
  restTime?: number;
  notes?: string;
  completed?: boolean;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  studentId: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  exercises: WorkoutExercise[];
  scheduledDays: number[];
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  studentId: string;
  scheduledDate: Date;
  startTime?: Date;
  endTime?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'skipped';
  exercises: SessionExercise[];
  feedback?: string;
  rating?: number;
  notes?: string;
}

export interface SessionExercise {
  exerciseId: string;
  sets: SessionSet[];
  completed: boolean;
  notes?: string;
}

export interface SessionSet {
  reps: number;
  weight?: number;
  completed: boolean;
  restTime?: number;
}
