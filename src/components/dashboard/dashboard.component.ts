import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { LucideAngularModule, TrendingUp, Users, DollarSign, Calendar, Target, Award } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, LucideAngularModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo de volta, {{ currentUser()?.name }}!</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        @if (currentUser()?.role === 'student') {
          <div class="stat-card">
            <div class="stat-icon success">
              <lucide-angular [img]="TrendingUpIcon" size="24"></lucide-angular>
            </div>
            <div class="stat-content">
              <h3>{{ studentStats.currentWeight }} kg</h3>
              <p>Peso Atual</p>
              <span class="stat-change positive">-2.5kg este mês</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon primary">
              <lucide-angular [img]="TargetIcon" size="24"></lucide-angular>
            </div>
            <div class="stat-content">
              <h3>{{ studentStats.imc }}</h3>
              <p>IMC</p>
              <span class="stat-change neutral">Normal</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon warning">
              <lucide-angular [img]="CalendarIcon" size="24"></lucide-angular>
            </div>
            <div class="stat-content">
              <h3>{{ studentStats.workoutsThisWeek }}</h3>
              <p>Treinos esta semana</p>
              <span class="stat-change positive">+1 vs semana passada</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon success">
              <lucide-angular [img]="AwardIcon" size="24"></lucide-angular>
            </div>
            <div class="stat-content">
              <h3>{{ studentStats.bodyFat }}%</h3>
              <p>Gordura Corporal</p>
              <span class="stat-change positive">-1.2% este mês</span>
            </div>
          </div>
        } @else {
          <div class="stat-card">
            <div class="stat-icon primary">
              <lucide-angular [img]="UsersIcon" size="24"></lucide-angular>
            </div>
            <div class="stat-content">
              <h3>{{ trainerStats.totalStudents }}</h3>
              <p>Alunos Ativos</p>
              <span class="stat-change positive">+3 este mês</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon success">
              <lucide-angular [img]="DollarSignIcon" size="24"></lucide-angular>
            </div>
            <div class="stat-content">
              <h3>R$ {{ trainerStats.monthlyRevenue.toLocaleString('pt-BR') }}</h3>
              <p>Receita Mensal</p>
              <span class="stat-change positive">+12% vs mês passado</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon warning">
              <lucide-angular [img]="CalendarIcon" size="24"></lucide-angular>
            </div>
            <div class="stat-content">
              <h3>{{ trainerStats.todayWorkouts }}</h3>
              <p>Treinos Hoje</p>
              <span class="stat-change neutral">8 agendados</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon primary">
              <lucide-angular [img]="TrendingUpIcon" size="24"></lucide-angular>
            </div>
            <div class="stat-content">
              <h3>{{ trainerStats.averageRating }}</h3>
              <p>Avaliação Média</p>
              <span class="stat-change positive">⭐ Excelente</span>
            </div>
          </div>
        }
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Weight Evolution -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Evolução do Peso</h3>
            <p>Últimos 12 meses</p>
          </div>
          <div class="chart-container">
            <div echarts [options]="weightChartOptions" class="chart"></div>
          </div>
        </div>

        <!-- IMC Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Índice de Massa Corporal</h3>
            <p>Com faixa ideal destacada</p>
          </div>
          <div class="chart-container">
            <div echarts [options]="imcChartOptions" class="chart"></div>
          </div>
        </div>

        <!-- Progress vs Target -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Progresso vs Meta</h3>
            <p>Objetivos principais</p>
          </div>
          <div class="chart-container">
            <div echarts [options]="progressChartOptions" class="chart"></div>
          </div>
        </div>

        <!-- Body Fat -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Percentual de Gordura</h3>
            <p>Evolução ao longo do tempo</p>
          </div>
          <div class="chart-container">
            <div echarts [options]="bodyFatChartOptions" class="chart"></div>
          </div>
        </div>

        <!-- Radar Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Desempenho Físico</h3>
            <p>Análise multidimensional</p>
          </div>
          <div class="chart-container">
            <div echarts [options]="radarChartOptions" class="chart"></div>
          </div>
        </div>

        <!-- Workout Distribution -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Distribuição de Treinos</h3>
            <p>Por tipo de exercício</p>
          </div>
          <div class="chart-container">
            <div echarts [options]="workoutDistributionOptions" class="chart"></div>
          </div>
        </div>
      </div>

      @if (currentUser()?.role === 'trainer') {
        <!-- Financial Charts for Trainers -->
        <div class="charts-grid">
          <div class="chart-card full-width">
            <div class="chart-header">
              <h3>Fluxo de Caixa</h3>
              <p>Receitas e despesas mensais</p>
            </div>
            <div class="chart-container">
              <div echarts [options]="cashFlowChartOptions" class="chart"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 0.5rem;
    }

    .dashboard-header p {
      color: var(--gray-600);
      font-size: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: var(--border-radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--gray-200);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--border-radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.primary { background-color: var(--primary-500); }
    .stat-icon.success { background-color: var(--success-500); }
    .stat-icon.warning { background-color: var(--warning-500); }

    .stat-content h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0 0 0.25rem 0;
    }

    .stat-content p {
      font-size: 0.875rem;
      color: var(--gray-600);
      margin: 0 0 0.5rem 0;
    }

    .stat-change {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: var(--border-radius-sm);
    }

    .stat-change.positive {
      background-color: var(--success-50);
      color: var(--success-600);
    }

    .stat-change.negative {
      background-color: var(--error-50);
      color: var(--error-600);
    }

    .stat-change.neutral {
      background-color: var(--gray-100);
      color: var(--gray-600);
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--gray-200);
      overflow: hidden;
    }

    .chart-card.full-width {
      grid-column: 1 / -1;
    }

    .chart-header {
      padding: 1.5rem 1.5rem 1rem 1.5rem;
      border-bottom: 1px solid var(--gray-200);
    }

    .chart-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 0.25rem 0;
    }

    .chart-header p {
      font-size: 0.875rem;
      color: var(--gray-600);
      margin: 0;
    }

    .chart-container {
      padding: 1rem;
      height: 300px;
    }

    .chart {
      width: 100%;
      height: 100%;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }

      .chart-container {
        height: 250px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private mockDataService = inject(MockDataService);

  currentUser = this.authService.currentUser;

  // Icons
  TrendingUpIcon = TrendingUp;
  UsersIcon = Users;
  DollarSignIcon = DollarSign;
  CalendarIcon = Calendar;
  TargetIcon = Target;
  AwardIcon = Award;

  // Stats
  studentStats = {
    currentWeight: 75.2,
    imc: 23.1,
    workoutsThisWeek: 4,
    bodyFat: 14.8
  };

  trainerStats = {
    totalStudents: 25,
    monthlyRevenue: 8750,
    todayWorkouts: 6,
    averageRating: 4.8
  };

  // Chart options
  weightChartOptions: EChartsOption = {};
  imcChartOptions: EChartsOption = {};
  progressChartOptions: EChartsOption = {};
  bodyFatChartOptions: EChartsOption = {};
  radarChartOptions: EChartsOption = {};
  workoutDistributionOptions: EChartsOption = {};
  cashFlowChartOptions: EChartsOption = {};

  ngOnInit(): void {
    this.initializeCharts();
  }

  private initializeCharts(): void {
    this.setupWeightChart();
    this.setupIMCChart();
    this.setupProgressChart();
    this.setupBodyFatChart();
    this.setupRadarChart();
    this.setupWorkoutDistributionChart();
    this.setupCashFlowChart();
  }

  private setupWeightChart(): void {
    const data = this.mockDataService.generateWeightProgression();
    
    this.weightChartOptions = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const point = params[0];
          return `${point.name}<br/>Peso: ${point.value} kg`;
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.date.toLocaleDateString('pt-BR', { month: 'short' })),
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      },
      series: [{
        data: data.map(item => item.weight),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#3b82f6', width: 3 },
        itemStyle: { color: '#3b82f6' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ]
          }
        }
      }],
      grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true }
    };
  }

  private setupIMCChart(): void {
    const data = this.mockDataService.generateIMCData();
    
    this.imcChartOptions = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const point = params[0];
          return `${point.name}<br/>IMC: ${point.value}`;
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.date.toLocaleDateString('pt-BR', { month: 'short' })),
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' }
      },
      yAxis: {
        type: 'value',
        min: 18,
        max: 30,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      },
      series: [
        {
          name: 'IMC',
          data: data.map(item => item.imc),
          type: 'line',
          smooth: true,
          lineStyle: { color: '#22c55e', width: 3 },
          itemStyle: { color: '#22c55e' }
        }
      ],
      grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
      // Add ideal range visualization
      visualMap: {
        show: false,
        pieces: [
          { min: 18.5, max: 24.9, color: '#22c55e' },
          { min: 25, max: 29.9, color: '#f59e0b' },
          { min: 30, max: 35, color: '#ef4444' }
        ],
        outOfRange: { color: '#6b7280' }
      }
    };
  }

  private setupProgressChart(): void {
    const data = this.mockDataService.generateProgressData();
    const categories = ['Peso', 'Força', 'Resistência', 'Flexibilidade', 'Coordenação'];
    
    this.progressChartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      },
      series: [
        {
          name: 'Meta',
          type: 'bar',
          data: data.map(item => item.target),
          itemStyle: { color: '#e5e7eb' },
          barWidth: '60%'
        },
        {
          name: 'Atual',
          type: 'bar',
          data: data.map(item => item.current),
          itemStyle: { color: '#3b82f6' },
          barWidth: '60%'
        }
      ],
      grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true }
    };
  }

  private setupBodyFatChart(): void {
    const data = this.mockDataService.generateBodyFatData();
    
    this.bodyFatChartOptions = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const point = params[0];
          return `${point.name}<br/>Gordura: ${point.value}%`;
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.date.toLocaleDateString('pt-BR', { month: 'short' })),
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      },
      series: [{
        data: data.map(item => item.percentage),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#f59e0b', width: 3 },
        itemStyle: { color: '#f59e0b' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0.05)' }
            ]
          }
        }
      }],
      grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true }
    };
  }

  private setupRadarChart(): void {
    const data = this.mockDataService.generateRadarData();
    
    this.radarChartOptions = {
      tooltip: {
        trigger: 'item'
      },
      radar: {
        indicator: data.map(item => ({ name: item.indicator, max: item.max })),
        radius: '70%',
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
        axisLabel: { color: '#6b7280' }
      },
      series: [{
        type: 'radar',
        data: [{
          value: data.map(item => item.value),
          itemStyle: { color: '#3b82f6' },
          areaStyle: { color: 'rgba(59, 130, 246, 0.3)' },
          lineStyle: { color: '#3b82f6', width: 2 }
        }]
      }]
    };
  }

  private setupWorkoutDistributionChart(): void {
    const data = this.mockDataService.generateWorkoutDistribution();
    
    this.workoutDistributionOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}% ({d}%)'
      },
      series: [{
        name: 'Treinos',
        type: 'pie',
        radius: ['40%', '70%'],
        data: data.map(item => ({
          value: item.percentage,
          name: item.type,
          itemStyle: { color: item.color }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }

  private setupCashFlowChart(): void {
    const data = this.mockDataService.generateCashFlowData();
    
    this.cashFlowChartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['Receitas', 'Despesas'],
        bottom: 0
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.month),
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280' },
        splitLine: { lineStyle: { color: '#f3f4f6' } }
      },
      series: [
        {
          name: 'Receitas',
          type: 'bar',
          data: data.map(item => item.income),
          itemStyle: { color: '#22c55e' }
        },
        {
          name: 'Despesas',
          type: 'bar',
          data: data.map(item => item.expenses),
          itemStyle: { color: '#ef4444' }
        }
      ],
      grid: { left: '3%', right: '4%', bottom: '15%', top: '3%', containLabel: true }
    };
  }
}
