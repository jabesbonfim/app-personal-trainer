export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'trainer' | 'admin';
  avatar?: string;
  phone?: string;
  birthDate?: Date;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  trainerId?: string;
  currentWeight?: number;
  height?: number;
  bodyFatPercentage?: number;
  membershipStatus: 'active' | 'inactive' | 'suspended';
  membershipType: string;
  membershipStartDate: Date;
  membershipEndDate: Date;
  goals: string[];
  medicalRestrictions?: string[];
}

export interface Trainer extends User {
  role: 'trainer';
  specialties: string[];
  students: string[];
  certification?: string;
  experience: number;
  hourlyRate?: number;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}
