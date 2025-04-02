import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            mode: 'index',
            intersect: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 5
            }
        }
    }
};

const AttendanceCharts = () => {
    const monthlyChartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Present',
                data: [92, 88, 95, 90],
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderRadius: 4,
            },
            {
                label: 'Absent',
                data: [8, 12, 5, 10],
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderRadius: 4,
            },
        ],
    };

    const weeklyChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
            {
                label: 'Present',
                data: [25, 27, 28, 26, 24, 8],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
            },
            {
                label: 'Absent',
                data: [5, 3, 2, 4, 6, 2],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
                fill: false,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: '#fff',
            },
            {
                label: 'Late Arrivals',
                data: [3, 2, 1, 4, 3, 0],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                tension: 0.3,
                fill: false,
                pointBackgroundColor: 'rgba(255, 206, 86, 1)',
                pointBorderColor: '#fff',
            }
        ]
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
                <div style={{ height: '300px' }}>
                    <Bar 
                        data={monthlyChartData} 
                        options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                title: {
                                    display: true,
                                    text: 'Attendance by Week (Last Month)',
                                    font: {
                                        size: 16
                                    }
                                }
                            }
                        }} 
                    />
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Weekly Overview</h2>
                <div style={{ height: '300px' }}>
                    <Line 
                        data={weeklyChartData}
                        options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                title: {
                                    display: true,
                                    text: 'Daily Attendance (This Week)',
                                    font: {
                                        size: 16
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AttendanceCharts;