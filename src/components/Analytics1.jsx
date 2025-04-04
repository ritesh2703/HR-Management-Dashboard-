import React, { useState } from 'react';
import { 
  FiDollarSign, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiFileText,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
ChartJS.register(...registerables);

const Analytics1 = ({ employees }) => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate analytics data based on employees
  const totalPayroll = employees.reduce((sum, emp) => {
    return sum + (emp.basicSalary + emp.hra + emp.da + emp.specialAllowance);
  }, 0);

  // Department breakdown calculation
  const departmentStats = employees.reduce((acc, emp) => {
    const dept = emp.department;
    const salary = emp.basicSalary + emp.hra + emp.da + emp.specialAllowance;
    
    if (!acc[dept]) {
      acc[dept] = { total: 0, count: 0 };
    }
    acc[dept].total += salary;
    acc[dept].count += 1;
    return acc;
  }, {});

  const departmentBreakdown = Object.entries(departmentStats).map(([name, stats]) => {
    const percentage = Math.round((stats.total / totalPayroll) * 100);
    return { 
      name, 
      value: percentage,
      amount: stats.total,
      count: stats.count,
      color: getDepartmentColor(name)
    };
  }).sort((a, b) => b.value - a.value);

  // Salary components calculation
  const totalBaseSalary = employees.reduce((sum, emp) => sum + emp.basicSalary, 0);
  const totalHRA = employees.reduce((sum, emp) => sum + emp.hra, 0);
  const totalDA = employees.reduce((sum, emp) => sum + emp.da, 0);
  const totalSpecialAllowance = employees.reduce((sum, emp) => sum + emp.specialAllowance, 0);
  const totalDeductions = employees.reduce((sum, emp) => sum + emp.pf + emp.tax + emp.tds, 0);

  // Calculate error trend
  const errorTrend = Array(12).fill(0).map((_, i) => {
    return parseFloat((2.5 - (i * 0.1) + (Math.random() * 0.3)).toFixed(1));
  });
  
  // Calculate monthly trend
  const monthlyTrend = Array(12).fill(0).map((_, i) => {
    const base = totalPayroll / 12;
    return Math.round(base * (0.9 + (i * 0.02) + (Math.random() * base * 0.1)));
  });
  
  const payrollData = {
    totalProcessed: totalPayroll,
    onTimeRate: 97,
    payslipsIssued: 98,
    errorRate: 2,
    highestPaidDept: departmentBreakdown[0],
    lowestPaidDept: departmentBreakdown[departmentBreakdown.length - 1],
    departmentBreakdown,
    salaryComponents: [
      { name: 'Base Salary', value: totalBaseSalary, percentage: Math.round((totalBaseSalary / totalPayroll) * 100) },
      { name: 'HRA', value: totalHRA, percentage: Math.round((totalHRA / totalPayroll) * 100) },
      { name: 'DA', value: totalDA, percentage: Math.round((totalDA / totalPayroll) * 100) },
      { name: 'Special Allowance', value: totalSpecialAllowance, percentage: Math.round((totalSpecialAllowance / totalPayroll) * 100) },
      { name: 'Deductions', value: totalDeductions, percentage: Math.round((totalDeductions / totalPayroll) * 100) }
    ],
    monthlyTrend,
    errorTrend,
    recentErrors: [
      { id: 1, employee: employees[0]?.name || 'Employee 1', department: employees[0]?.department || 'Engineering', type: 'Overtime miscalculation', date: '2023-04-15', status: 'Resolved' },
      { id: 2, employee: employees[1]?.name || 'Employee 2', department: employees[1]?.department || 'Marketing', type: 'Tax deduction error', date: '2023-04-10', status: 'Pending' },
      { id: 3, employee: employees[2]?.name || 'Employee 3', department: employees[2]?.department || 'Engineering', type: 'Bonus missing', date: '2023-04-05', status: 'Resolved' }
    ]
  };

  // Helper function to assign colors based on department
  function getDepartmentColor(dept) {
    const colors = {
      'Engineering': '#36A2EB',
      'HR': '#FF6384',
      'Marketing': '#FFCE56',
      'Sales': '#4BC0C0',
      'Operations': '#9966FF',
      'Design': '#FF9F40',
      'Finance': '#8AC24A',
      'Quality Assurance': '#607D8B',
      'Analytics': '#9C27B0'
    };
    return colors[dept] || '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleDownload = () => {
    const payrollExport = employees.map(emp => ({
      'Employee ID': emp.id,
      'Name': emp.name,
      'Department': emp.department,
      'Position': emp.position,
      'Basic Salary': `₹${emp.basicSalary.toLocaleString('en-IN')}`,
      'HRA': `₹${emp.hra.toLocaleString('en-IN')}`,
      'DA': `₹${emp.da.toLocaleString('en-IN')}`,
      'Special Allowance': `₹${emp.specialAllowance.toLocaleString('en-IN')}`,
      'Total Earnings': `₹${(emp.basicSalary + emp.hra + emp.da + emp.specialAllowance).toLocaleString('en-IN')}`,
      'PF': `₹${emp.pf.toLocaleString('en-IN')}`,
      'Tax': `₹${emp.tax.toLocaleString('en-IN')}`,
      'TDS': `₹${emp.tds.toLocaleString('en-IN')}`,
      'Total Deductions': `₹${(emp.pf + emp.tax + emp.tds).toLocaleString('en-IN')}`,
      'Net Salary': `₹${(emp.basicSalary + emp.hra + emp.da + emp.specialAllowance - emp.pf - emp.tax - emp.tds).toLocaleString('en-IN')}`
    }));

    const ws = XLSX.utils.json_to_sheet(payrollExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Data");
    XLSX.writeFile(wb, `Payroll_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Chart data configurations
  const departmentChartData = {
    labels: payrollData.departmentBreakdown.map(dept => dept.name),
    datasets: [{
      data: payrollData.departmentBreakdown.map(dept => dept.value),
      backgroundColor: payrollData.departmentBreakdown.map(dept => dept.color),
      borderWidth: 1
    }]
  };

  const salaryChartData = {
    labels: payrollData.salaryComponents.map(comp => comp.name),
    datasets: [{
      data: payrollData.salaryComponents.map(comp => comp.percentage),
      backgroundColor: [
        '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF6384'
      ],
      borderWidth: 1
    }]
  };

  const trendChartData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Payroll Amount',
        data: payrollData.monthlyTrend,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Error Rate (%)',
        data: payrollData.errorTrend,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const trendChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.datasetIndex === 0) {
              label += '₹' + context.raw.toLocaleString('en-IN');
            } else {
              label += context.raw + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Payroll Amount (₹)'
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      },
      y1: {
        position: 'right',
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Error Rate (%)'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  // Format currency in Indian Rupees
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payroll Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive overview of payroll metrics and trends</p>
        </div>
        <div className="flex space-x-3 mt-3 md:mt-0">
          <select 
            className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button 
            onClick={handleRefresh}
            className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
            disabled={isLoading}
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center bg-blue-600 text-white rounded-md px-3 py-2 text-sm hover:bg-blue-700"
          >
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <FiDollarSign className="text-blue-600 text-xl mr-2" />
                <span className="text-sm font-medium text-gray-600">Total Payroll</span>
              </div>
              <p className="text-2xl font-bold mt-2">{formatINR(payrollData.totalProcessed)}</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">+5.2% from last month</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <FiCheckCircle className="text-green-600 text-xl mr-2" />
                <span className="text-sm font-medium text-gray-600">On Time Rate</span>
              </div>
              <p className="text-2xl font-bold mt-2">{payrollData.onTimeRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <div className="radial-progress text-green-600" style={{"--value": payrollData.onTimeRate, "--size": "2.5rem"}}>
                {payrollData.onTimeRate}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <FiFileText className="text-purple-600 text-xl mr-2" />
                <span className="text-sm font-medium text-gray-600">Payslips Issued</span>
              </div>
              <p className="text-2xl font-bold mt-2">{payrollData.payslipsIssued}%</p>
            </div>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">98.5% employee satisfaction</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <FiAlertCircle className="text-red-600 text-xl mr-2" />
                <span className="text-sm font-medium text-gray-600">Error Rate</span>
              </div>
              <p className="text-2xl font-bold mt-2">{payrollData.errorRate}%</p>
            </div>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">-0.5% from last month</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Department Breakdown */}
        <div className="lg:col-span-1 bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              <FiPieChart className="text-purple-600 mr-2" /> Department Breakdown
            </h3>
            <button className="text-sm flex items-center text-gray-500 hover:text-gray-700">
              <FiFilter className="mr-1" /> Filter
            </button>
          </div>
          <div className="h-64">
            <Pie 
              data={departmentChartData} 
              options={{
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        const dept = payrollData.departmentBreakdown.find(d => d.name === label);
                        return `${label}: ${percentage}% (${formatINR(dept?.amount || 0)})`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-600">Highest Paid Department:</p>
              <p className="text-sm font-semibold">
                {payrollData.highestPaidDept.name} ({payrollData.highestPaidDept.value}%)
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-600">Lowest Paid Department:</p>
              <p className="text-sm font-semibold">
                {payrollData.lowestPaidDept.name} ({payrollData.lowestPaidDept.value}%)
              </p>
            </div>
          </div>
        </div>
        
        {/* Salary Components */}
        <div className="lg:col-span-1 bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              <FiBarChart2 className="text-blue-600 mr-2" /> Salary Composition
            </h3>
            <button className="text-sm flex items-center text-gray-500 hover:text-gray-700">
              <FiFilter className="mr-1" /> Filter
            </button>
          </div>
          <div className="h-64">
            <Pie 
              data={salaryChartData} 
              options={{
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const component = payrollData.salaryComponents.find(c => c.name === label);
                        return `${label}: ${value}% (${formatINR(component?.value || 0)})`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 pt-4 border-t">
            {payrollData.salaryComponents.map((component, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{backgroundColor: salaryChartData.datasets[0].backgroundColor[index]}}
                  ></span>
                  <span className="text-sm text-gray-600">{component.name}</span>
                </div>
                <span className="text-sm font-semibold">{formatINR(component.value)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Payroll Trends */}
        <div className="lg:col-span-1 bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              <FiTrendingUp className="text-green-600 mr-2" /> Payroll Trends
            </h3>
            <div className="flex space-x-2">
              <button 
                className={`text-xs px-2 py-1 rounded ${timeRange === 'monthly' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setTimeRange('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`text-xs px-2 py-1 rounded ${timeRange === 'quarterly' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setTimeRange('quarterly')}
              >
                Quarterly
              </button>
              <button 
                className={`text-xs px-2 py-1 rounded ${timeRange === 'yearly' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setTimeRange('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="h-64">
            <Bar 
              data={trendChartData} 
              options={trendChartOptions}
            />
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Key Observations:</p>
            <ul className="text-xs space-y-1">
              <li className="flex items-start">
                <span className="text-green-500 mr-1">✓</span>
                <span>Payroll has increased by 12% over the last 6 months</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-1">⚠</span>
                <span>Error rate is decreasing but needs more improvement</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-1">•</span>
                <span>Q4 typically has highest payroll due to bonuses</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Errors */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              <FiAlertCircle className="text-red-600 mr-2" /> Recent Payroll Errors
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollData.recentErrors.map((error) => (
                  <tr key={error.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{error.employee}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{error.department}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{error.type}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        error.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {error.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Performance Metrics</h3>
            <FiCalendar className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-gray-600 mb-1">Payroll Processing Time</p>
              <div className="flex items-end">
                <p className="text-2xl font-semibold mr-2">4.2</p>
                <p className="text-sm text-gray-500 mb-1">days</p>
              </div>
              <p className="text-xs text-green-600 mt-1">Improved by 12%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-gray-600 mb-1">Error Resolution Time</p>
              <div className="flex items-end">
                <p className="text-2xl font-semibold mr-2">2.5</p>
                <p className="text-sm text-gray-500 mb-1">days</p>
              </div>
              <p className="text-xs text-red-600 mt-1">Increased by 8%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-gray-600 mb-1">Employee Satisfaction</p>
              <div className="flex items-end">
                <p className="text-2xl font-semibold mr-2">94%</p>
              </div>
              <p className="text-xs text-green-600 mt-1">+3% from last quarter</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-gray-600 mb-1">Cost per Payroll</p>
              <div className="flex items-end">
                <p className="text-2xl font-semibold mr-2">₹3.20</p>
                <p className="text-sm text-gray-500 mb-1">per employee</p>
              </div>
              <p className="text-xs text-green-600 mt-1">Reduced by 15%</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Recommendations:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Automate overtime calculations to reduce errors</li>
              <li>Implement additional validation checks for tax deductions</li>
              <li>Provide training on new payroll software features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics1;