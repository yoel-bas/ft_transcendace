'use client'
import React from 'react';
import ReactApexChart from 'react-apexcharts';

// Define the types for your component's props (if any)
interface ApexChartProps {}

// Define the types for the state variables used in the component
interface ApexChartState {
  series: number[];
  options: ApexCharts.ApexOptions;
}

const Pie_stats_chart: React.FC<ApexChartProps> = () => {
  const [chartState, setChartState] = React.useState<ApexChartState>({
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        width: 280,
        type: 'donut',
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      fill: {
        type: 'gradient',
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'none',
            },
          },
        },
      ],
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="donut"
          width={380}
        />
      </div>
    </div>
  );
};

export default Pie_stats_chart;
