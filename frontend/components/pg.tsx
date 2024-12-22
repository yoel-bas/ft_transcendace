'use client'
import React, { useRef, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart: React.FC = () => {
  const chartRef = useRef(null);

  const data = {
    labels: ['Search Engine', 'Direct', 'Email', 'Union Ads'],
    datasets: [
      {
        label: 'Access From',
        data: [1048, 735, 580, 484],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 0.5,
        hoverOffset: 10, // This makes the hover effect more pronounced
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow dynamic resizing
    plugins: {
      legend: {
        position: 'left' as const, // Position of the legend
        labels: {
          font: {
            size: 10,
            boxWidth: 5, // Adjust the label font size here
          },
        },
      },
      
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw} views`;
          },
        },
      },
    },
    cutout: '50%', 
  };

  // Recalculate chart size on window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        (chartRef.current as any).resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='  w-full' style={{ width: '100%', maxWidth: '600px', height: 'auto', margin: '0 auto' }}>
      <Doughnut ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default DonutChart;
