export interface BodyMeasurement {
  id: string;
  studentId: string;
  weight?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  measurements: {
    chest?: number;
    waist?: number;
    hips?: number;
    bicep?: number;
    thigh?: number;
    neck?: number;
  };
  recordedAt: Date;
  recordedBy: string;
}

export interface ProgressPhoto {
  id: string;
  studentId: string;
  imageUrl: string;
  angle: 'front' | 'side' | 'back';
  takenAt: Date;
  notes?: string;
}

export interface Goal {
  id: string;
  studentId: string;
  type: 'weight-loss' | 'weight-gain' | 'muscle-gain' | 'strength' | 'endurance' | 'other';
  description: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  targetDate: Date;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  createdAt: Date;
}
