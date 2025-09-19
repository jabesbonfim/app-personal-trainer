import * as echarts from 'echarts/core';

// Import charts, features and renderers
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  CanvasRenderer,
]);

// This function will be used by ngx-echarts
export function echartsInstance(): any {
  return echarts;
}
