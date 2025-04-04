import React, { useState } from 'react';
import { FiFileText, FiUsers, FiAlertCircle, FiDownload, FiPrinter, FiFilter } from 'react-icons/fi';
import { CSVLink } from 'react-csv';

const Reports = ({ employees, payrollRecords }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    employeeType: '',
    dateRange: ''
  });

  // Report types with descriptions
  const reportTypes = [
    {
      id: 'monthly-summary',
      title: 'Monthly Payroll Summary',
      description: 'Detailed breakdown of monthly payroll',
      icon: <FiFileText className="text-blue-600" />
    },
    {
      id: 'employee-wise',
      title: 'Employee Wise Report',
      description: 'Salary details by employee',
      icon: <FiUsers className="text-green-600" />
    },
    {
      id: 'compliance',
      title: 'Compliance Reports',
      description: 'PF, TDS, ESI filings',
      icon: <FiAlertCircle className="text-red-600" />
    },
    {
      id: 'department-wise',
      title: 'Department Wise Report',
      description: 'Salary breakdown by department',
      icon: <FiUsers className="text-purple-600" />
    },
    {
      id: 'tax-summary',
      title: 'Tax Deduction Summary',
      description: 'Detailed tax deductions report',
      icon: <FiFileText className="text-orange-600" />
    },
    {
      id: 'leave-balance',
      title: 'Leave Balance Report',
      description: 'Employee leave balances',
      icon: <FiFileText className="text-teal-600" />
    }
  ];

  // Filter employees based on selected filters
  const filteredEmployees = employees.filter(emp => {
    return (
      (filters.department === '' || emp.department === filters.department) &&
      (filters.employeeType === '' || emp.employmentType === filters.employeeType)
    );
  });

  // Generate CSV data for employee-wise report
  const employeeCSVData = filteredEmployees.map(emp => ({
    'Employee ID': emp.id,
    'Name': emp.name,
    'Department': emp.department,
    'Position': emp.position,
    'Employment Type': emp.employmentType,
    'Basic Salary': emp.basicSalary,
    'HRA': emp.hra,
    'DA': emp.da,
    'Special Allowance': emp.specialAllowance,
    'PF Deduction': emp.pf,
    'Tax Deduction': emp.tax,
    'TDS': emp.tds,
    'Net Salary': emp.salary,
    'Bank Name': emp.bankName,
    'Account Number': emp.accountNumber,
    'IFSC Code': emp.ifscCode
  }));

  // Generate department-wise summary
  const departmentSummary = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = {
        count: 0,
        totalSalary: 0,
        totalPF: 0,
        totalTax: 0
      };
    }
    acc[emp.department].count++;
    acc[emp.department].totalSalary += emp.basicSalary + emp.hra + emp.da + emp.specialAllowance;
    acc[emp.department].totalPF += emp.pf;
    acc[emp.department].totalTax += emp.tax + emp.tds;
    return acc;
  }, {});

  // Generate CSV data for department-wise report
  const departmentCSVData = Object.entries(departmentSummary).map(([dept, data]) => ({
    'Department': dept,
    'Employee Count': data.count,
    'Total Salary': data.totalSalary,
    'Total PF Contribution': data.totalPF,
    'Total Tax Deductions': data.totalTax,
    'Average Salary': Math.round(data.totalSalary / data.count)
  }));

  // Generate compliance report data
  const complianceData = employees.map(emp => ({
    'Employee ID': emp.id,
    'Name': emp.name,
    'PAN Number': emp.panNumber,
    'UAN Number': emp.uanNumber,
    'PF Contribution (Employee)': emp.pf,
    'PF Contribution (Employer)': emp.pf, // Assuming equal employer contribution
    'Total PF': emp.pf * 2,
    'TDS Deducted': emp.tds,
    'Professional Tax': emp.tax
  }));

  // Generate leave balance report
  const leaveBalanceData = employees.map(emp => ({
    'Employee ID': emp.id,
    'Name': emp.name,
    'Department': emp.department,
    'Casual Leave Taken': emp.leaveBalances.casualLeave.taken,
    'Casual Leave Remaining': emp.leaveBalances.casualLeave.remaining,
    'Sick Leave Taken': emp.leaveBalances.sickLeave.taken,
    'Sick Leave Remaining': emp.leaveBalances.sickLeave.remaining,
    'Earned Leave Taken': emp.leaveBalances.earnedLeave.taken,
    'Earned Leave Remaining': emp.leaveBalances.earnedLeave.remaining
  }));

  // Render selected report
  const renderReport = () => {
    switch (selectedReport) {
      case 'monthly-summary':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Payroll Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Month</th>
                    <th className="py-2 px-4 border">Status</th>
                    <th className="py-2 px-4 border">Total Amount</th>
                    <th className="py-2 px-4 border">Employees Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border">{record.month}</td>
                      <td className="py-2 px-4 border">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.status === 'Processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border">{record.total}</td>
                      <td className="py-2 px-4 border">{employees.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <CSVLink 
                data={payrollRecords} 
                filename="monthly-payroll-summary.csv"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FiDownload className="mr-2" /> Export as CSV
              </CSVLink>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                <FiPrinter className="mr-2" /> Print Report
              </button>
            </div>
          </div>
        );
      
      case 'employee-wise':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Employee Wise Payroll Report</h3>
            <div className="mb-4 flex items-center space-x-4">
              <div className="flex items-center">
                <FiFilter className="text-gray-500 mr-2" />
                <select 
                  className="border rounded px-3 py-1 text-sm"
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                >
                  <option value="">All Departments</option>
                  {[...new Set(employees.map(emp => emp.department))].map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <FiFilter className="text-gray-500 mr-2" />
                <select 
                  className="border rounded px-3 py-1 text-sm"
                  value={filters.employeeType}
                  onChange={(e) => setFilters({...filters, employeeType: e.target.value})}
                >
                  <option value="">All Employment Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Employee ID</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Department</th>
                    <th className="py-2 px-4 border">Basic Salary</th>
                    <th className="py-2 px-4 border">Allowances</th>
                    <th className="py-2 px-4 border">Deductions</th>
                    <th className="py-2 px-4 border">Net Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border">{emp.id}</td>
                      <td className="py-2 px-4 border">{emp.name}</td>
                      <td className="py-2 px-4 border">{emp.department}</td>
                      <td className="py-2 px-4 border">₹{emp.basicSalary.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-4 border">
                        <div className="text-xs">
                          <div>HRA: ₹{emp.hra.toLocaleString('en-IN')}</div>
                          <div>DA: ₹{emp.da.toLocaleString('en-IN')}</div>
                          <div>SA: ₹{emp.specialAllowance.toLocaleString('en-IN')}</div>
                        </div>
                      </td>
                      <td className="py-2 px-4 border">
                        <div className="text-xs">
                          <div>PF: ₹{emp.pf.toLocaleString('en-IN')}</div>
                          <div>Tax: ₹{emp.tax.toLocaleString('en-IN')}</div>
                          <div>TDS: ₹{emp.tds.toLocaleString('en-IN')}</div>
                        </div>
                      </td>
                      <td className="py-2 px-4 border font-medium">{emp.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <CSVLink 
                data={employeeCSVData} 
                filename="employee-wise-payroll.csv"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FiDownload className="mr-2" /> Export as CSV
              </CSVLink>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                <FiPrinter className="mr-2" /> Print Report
              </button>
            </div>
          </div>
        );
      
      case 'compliance':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Compliance Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Provident Fund (PF) Summary</h4>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="py-1">Total Employees:</td>
                      <td className="py-1 font-medium">{employees.length}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Total Employee PF:</td>
                      <td className="py-1 font-medium">₹{employees.reduce((sum, emp) => sum + emp.pf, 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Total Employer PF:</td>
                      <td className="py-1 font-medium">₹{employees.reduce((sum, emp) => sum + emp.pf, 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Total PF Contribution:</td>
                      <td className="py-1 font-medium">₹{(employees.reduce((sum, emp) => sum + emp.pf, 0) * 2).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Tax Deduction at Source (TDS)</h4>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="py-1">Total TDS Deducted:</td>
                      <td className="py-1 font-medium">₹{employees.reduce((sum, emp) => sum + emp.tds, 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Total Professional Tax:</td>
                      <td className="py-1 font-medium">₹{employees.reduce((sum, emp) => sum + emp.tax, 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Total Tax Deductions:</td>
                      <td className="py-1 font-medium">₹{employees.reduce((sum, emp) => sum + emp.tax + emp.tds, 0).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Employee ID</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">PAN Number</th>
                    <th className="py-2 px-4 border">UAN Number</th>
                    <th className="py-2 px-4 border">PF (Employee)</th>
                    <th className="py-2 px-4 border">PF (Employer)</th>
                    <th className="py-2 px-4 border">Total PF</th>
                    <th className="py-2 px-4 border">TDS</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border">{emp.id}</td>
                      <td className="py-2 px-4 border">{emp.name}</td>
                      <td className="py-2 px-4 border">{emp.panNumber}</td>
                      <td className="py-2 px-4 border">{emp.uanNumber}</td>
                      <td className="py-2 px-4 border">₹{emp.pf.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-4 border">₹{emp.pf.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-4 border">₹{(emp.pf * 2).toLocaleString('en-IN')}</td>
                      <td className="py-2 px-4 border">₹{emp.tds.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <CSVLink 
                data={complianceData} 
                filename="compliance-report.csv"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FiDownload className="mr-2" /> Export as CSV
              </CSVLink>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                <FiPrinter className="mr-2" /> Print Report
              </button>
            </div>
          </div>
        );
      
      case 'department-wise':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Department Wise Payroll Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Department</th>
                    <th className="py-2 px-4 border">Employees</th>
                    <th className="py-2 px-4 border">Total Salary</th>
                    <th className="py-2 px-4 border">Average Salary</th>
                    <th className="py-2 px-4 border">Total PF</th>
                    <th className="py-2 px-4 border">Total Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(departmentSummary).map(([dept, data]) => (
                    <tr key={dept} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border">{dept}</td>
                      <td className="py-2 px-4 border">{data.count}</td>
                      <td className="py-2 px-4 border">₹{data.totalSalary.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-4 border">₹{Math.round(data.totalSalary / data.count).toLocaleString('en-IN')}</td>
                      <td className="py-2 px-4 border">₹{data.totalPF.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-4 border">₹{data.totalTax.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <CSVLink 
                data={departmentCSVData} 
                filename="department-wise-summary.csv"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FiDownload className="mr-2" /> Export as CSV
              </CSVLink>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                <FiPrinter className="mr-2" /> Print Report
              </button>
            </div>
          </div>
        );
      
      case 'tax-summary':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Tax Deduction Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium mb-2 text-blue-800">Total Tax Deductions</h4>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{employees.reduce((sum, emp) => sum + emp.tax + emp.tds, 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="border rounded-lg p-4 bg-green-50">
                <h4 className="font-medium mb-2 text-green-800">Average Tax per Employee</h4>
                <p className="text-2xl font-bold text-green-600">
                  ₹{Math.round(employees.reduce((sum, emp) => sum + emp.tax + emp.tds, 0) / employees.length).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="border rounded-lg p-4 bg-purple-50">
                <h4 className="font-medium mb-2 text-purple-800">Highest Tax Payer</h4>
                <p className="text-xl font-bold text-purple-600">
                  {employees.reduce((max, emp) => (emp.tax + emp.tds) > (max.tax + max.tds) ? emp : max, employees[0]).name}
                </p>
                <p className="text-sm">
                  ₹{(employees.reduce((max, emp) => (emp.tax + emp.tds) > (max.tax + max.tds) ? emp : max, employees[0]).tax + 
                    employees.reduce((max, emp) => (emp.tax + emp.tds) > (max.tax + max.tds) ? emp : max, employees[0]).tds).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Employee ID</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">PAN Number</th>
                    <th className="py-2 px-4 border">Annual Salary</th>
                    <th className="py-2 px-4 border">Professional Tax</th>
                    <th className="py-2 px-4 border">TDS</th>
                    <th className="py-2 px-4 border">Total Tax</th>
                    <th className="py-2 px-4 border">Tax %</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => {
                    const annualSalary = (emp.basicSalary + emp.hra + emp.da + emp.specialAllowance) * 12;
                    const totalTax = emp.tax + emp.tds;
                    const taxPercentage = ((totalTax * 12) / annualSalary * 100).toFixed(2);
                    
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{emp.id}</td>
                        <td className="py-2 px-4 border">{emp.name}</td>
                        <td className="py-2 px-4 border">{emp.panNumber}</td>
                        <td className="py-2 px-4 border">₹{annualSalary.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-4 border">₹{emp.tax.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-4 border">₹{emp.tds.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-4 border">₹{totalTax.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-4 border">{taxPercentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                <FiDownload className="mr-2" /> Export as CSV
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                <FiPrinter className="mr-2" /> Print Report
              </button>
            </div>
          </div>
        );
      
      case 'leave-balance':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Employee Leave Balance Report</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Employee ID</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Department</th>
                    <th className="py-2 px-4 border">Casual Leave</th>
                    <th className="py-2 px-4 border">Sick Leave</th>
                    <th className="py-2 px-4 border">Earned Leave</th>
                    <th className="py-2 px-4 border">Total Leaves Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border">{emp.id}</td>
                      <td className="py-2 px-4 border">{emp.name}</td>
                      <td className="py-2 px-4 border">{emp.department}</td>
                      <td className="py-2 px-4 border">
                        {emp.leaveBalances.casualLeave.taken}/{emp.leaveBalances.casualLeave.total} (Remaining: {emp.leaveBalances.casualLeave.remaining})
                      </td>
                      <td className="py-2 px-4 border">
                        {emp.leaveBalances.sickLeave.taken}/{emp.leaveBalances.sickLeave.total} (Remaining: {emp.leaveBalances.sickLeave.remaining})
                      </td>
                      <td className="py-2 px-4 border">
                        {emp.leaveBalances.earnedLeave.taken}/{emp.leaveBalances.earnedLeave.total} (Remaining: {emp.leaveBalances.earnedLeave.remaining})
                      </td>
                      <td className="py-2 px-4 border font-medium">
                        {emp.leaveBalances.casualLeave.taken + emp.leaveBalances.sickLeave.taken + emp.leaveBalances.earnedLeave.taken}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <CSVLink 
                data={leaveBalanceData} 
                filename="leave-balance-report.csv"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FiDownload className="mr-2" /> Export as CSV
              </CSVLink>
              <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                <FiPrinter className="mr-2" /> Print Report
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-6">Payroll Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {reportTypes.map(report => (
          <div 
            key={report.id}
            className={`border rounded-lg p-4 hover:shadow-md cursor-pointer transition-all ${selectedReport === report.id ? 'border-blue-500 bg-blue-50' : ''}`}
            onClick={() => setSelectedReport(report.id)}
          >
            <h3 className="font-medium mb-2 flex items-center">
              {report.icon} <span className="ml-2">{report.title}</span>
            </h3>
            <p className="text-sm text-gray-600">{report.description}</p>
          </div>
        ))}
      </div>

      {selectedReport && renderReport()}

      <div className="bg-yellow-50 p-4 rounded-md flex items-start mt-6">
        <FiAlertCircle className="text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-yellow-800">Upcoming Compliance</h3>
          <p className="text-sm text-yellow-700 mt-1">
            PF payment due on 15th May 2025 for April 2025 payroll. Total PF contribution: ₹
            {(employees.reduce((sum, emp) => sum + emp.pf, 0) * 2).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;