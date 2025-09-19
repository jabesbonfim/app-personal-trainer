export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  type: 'monthly' | 'personal-training' | 'assessment' | 'other';
  description?: string;
  method?: 'cash' | 'card' | 'transfer' | 'pix';
  transactionId?: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  totalStudents: number;
  activeStudents: number;
  monthlyGrowth: number;
  averagePaymentDelay: number;
}
