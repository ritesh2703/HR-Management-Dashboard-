import React, { useState } from 'react';
import { FiDollarSign, FiDownload, FiFileText, FiPrinter, FiEye, FiCheckCircle, FiX, FiUser } from 'react-icons/fi';

const Payroll = ({ employees = [], payrollRecords: initialRecords = [] }) => {
  // State management
  const [payrollTab, setPayrollTab] = useState('processing');
  const [payrollRecords, setPayrollRecords] = useState(initialRecords);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEmployeeDetailOpen, setIsEmployeeDetailOpen] = useState(false);
  const [currentPayroll, setCurrentPayroll] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processedPayroll, setProcessedPayroll] = useState(null);
  const [showEmployeeNames, setShowEmployeeNames] = useState(false);

  // Form data
  const [payrollData, setPayrollData] = useState({
    payPeriodStart: '',
    payPeriodEnd: '',
    paymentDate: '',
    bonusAmount: 0,
    deductions: 0,
    notes: ''
  });

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayrollData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle employee selection
  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId) 
        : [...prev, employeeId]
    );
  };

  // View employee details
  const viewEmployeeDetails = (employee) => {
    setCurrentEmployee(employee);
    setIsEmployeeDetailOpen(true);
  };

  // Calculate payroll summary
  const calculatePayroll = () => {
    const selected = employees.filter(emp => selectedEmployees.includes(emp.id));
    const totalAmount = selected.reduce((sum, emp) => {
      const basic = emp.basicSalary || 0;
      const hra = emp.hra || 0;
      const da = emp.da || 0;
      const allowance = emp.specialAllowance || 0;
      const deductions = (emp.pf || 0) + (emp.tax || 0) + (emp.tds || 0);
      return sum + basic + hra + da + allowance - deductions + (Number(payrollData.bonusAmount) || 0) - (Number(payrollData.deductions) || 0);
    }, 0);

    return {
      selectedEmployees: selected,
      totalAmount,
      employeeCount: selected.length,
      date: payrollData.paymentDate || new Date().toISOString().split('T')[0],
      bonusAmount: payrollData.bonusAmount,
      additionalDeductions: payrollData.deductions,
      payPeriodStart: payrollData.payPeriodStart,
      payPeriodEnd: payrollData.payPeriodEnd
    };
  };

  // Calculate individual net salary
  const calculateNetSalary = (employee) => {
    const basic = employee.basicSalary || 0;
    const hra = employee.hra || 0;
    const da = employee.da || 0;
    const allowance = employee.specialAllowance || 0;
    const deductions = (employee.pf || 0) + (employee.tax || 0) + (employee.tds || 0);
    const bonus = Number(payrollData.bonusAmount) || 0;
    const additionalDeductions = Number(payrollData.deductions) || 0;
    
    return basic + hra + da + allowance - deductions + bonus - additionalDeductions;
  };

  // Process payroll handler
  const handleProcessPayroll = () => {
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee');
      return;
    }
    if (!payrollData.paymentDate) {
      alert('Please select a payment date');
      return;
    }
    
    const calculated = calculatePayroll();
    setCurrentPayroll(calculated);
    setIsPreviewModalOpen(true);
  };

  // Confirm payroll processing
  const confirmProcessPayroll = () => {
    const monthYear = new Date(payrollData.payPeriodStart).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const processed = {
      id: `payroll-${Date.now()}`,
      month: monthYear,
      status: "Processed",
      total: currentPayroll.totalAmount,
      employeeCount: currentPayroll.employeeCount,
      date: payrollData.paymentDate,
      payPeriodStart: payrollData.payPeriodStart,
      payPeriodEnd: payrollData.payPeriodEnd,
      details: currentPayroll.selectedEmployees.map(emp => ({
        id: emp.id,
        name: emp.name,
        position: emp.position,
        department: emp.department,
        basicSalary: emp.basicSalary,
        allowances: (emp.hra || 0) + (emp.da || 0) + (emp.specialAllowance || 0),
        deductions: (emp.pf || 0) + (emp.tax || 0) + (emp.tds || 0),
        bonus: currentPayroll.bonusAmount,
        additionalDeductions: currentPayroll.additionalDeductions,
        netSalary: calculateNetSalary(emp),
        status: "Paid",
        paymentDate: payrollData.paymentDate,
        bankDetails: {
          bankName: emp.bankName,
          accountNumber: emp.accountNumber,
          ifscCode: emp.ifscCode
        }
      }))
    };
    
    setPayrollRecords([processed, ...payrollRecords]);
    setProcessedPayroll(processed);
    setIsPreviewModalOpen(false);
    setIsSuccessModalOpen(true);
    
    // Reset form
    setPayrollData({
      payPeriodStart: '',
      payPeriodEnd: '',
      paymentDate: '',
      bonusAmount: 0,
      deductions: 0,
      notes: ''
    });
    setSelectedEmployees([]);
  };

  // Export payroll data for bank
  const handleExportForBank = () => {
    if (!processedPayroll) return;
    
    const exportData = processedPayroll.details.map(emp => ({
      'Employee ID': emp.id,
      'Employee Name': emp.name,
      'Bank Name': emp.bankDetails?.bankName || 'N/A',
      'Account Number': emp.bankDetails?.accountNumber || 'N/A',
      'IFSC Code': emp.bankDetails?.ifscCode || 'N/A',
      'Amount': `₹${emp.netSalary?.toLocaleString('en-IN') || '0'}`,
      'Payment Date': processedPayroll.date,
      'Status': emp.status
    }));
    
    // Convert to CSV
    const headers = Object.keys(exportData[0]);
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => 
          `"${row[header]}"`
        ).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payroll_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print payslips
  const handlePrintPayslips = () => {
    if (!processedPayroll) return;
    
    const printContent = `
      <html>
        <head>
          <title>Payslips - ${processedPayroll.month}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .payslip { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; page-break-after: always; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .payslip-title { font-size: 18px; margin: 10px 0; }
            .employee-info { margin-bottom: 20px; }
            .salary-details { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .salary-details th, .salary-details td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .salary-details th { background-color: #f2f2f2; }
            .total { font-weight: bold; }
            .status { 
              padding: 4px 8px; 
              border-radius: 12px; 
              font-size: 12px; 
              font-weight: bold;
              display: inline-block;
              margin-top: 10px;
            }
            .paid { background-color: #d1fae5; color: #065f46; }
            @media print {
              body { -webkit-print-color-adjust: exact; }
              .no-print { display: none; }
              .payslip { page-break-after: always; }
            }
          </style>
        </head>
        <body>
          ${processedPayroll.details.map(emp => `
            <div class="payslip">
              <div class="header">
                <div class="company-name">Your Company Name</div>
                <div class="payslip-title">PAYSLIP FOR ${processedPayroll.month}</div>
                <div>Payment Date: ${processedPayroll.date}</div>
              </div>
              
              <div class="employee-info">
                <div><strong>Employee ID:</strong> ${emp.id}</div>
                <div><strong>Employee Name:</strong> ${emp.name}</div>
                <div><strong>Position:</strong> ${emp.position}</div>
                <div><strong>Department:</strong> ${emp.department}</div>
                <div class="status paid">${emp.status}</div>
              </div>
              
              <table class="salary-details">
                <tr>
                  <th>Earnings</th>
                  <th>Amount (₹)</th>
                  <th>Deductions</th>
                  <th>Amount (₹)</th>
                </tr>
                <tr>
                  <td>Basic Salary</td>
                  <td>${emp.basicSalary?.toLocaleString('en-IN') || '0'}</td>
                  <td>PF</td>
                  <td>${((emp.deductions || 0) * 0.6).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>HRA</td>
                  <td>${((emp.allowances || 0) * 0.4).toLocaleString('en-IN')}</td>
                  <td>Tax</td>
                  <td>${((emp.deductions || 0) * 0.3).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>DA</td>
                  <td>${((emp.allowances || 0) * 0.3).toLocaleString('en-IN')}</td>
                  <td>TDS</td>
                  <td>${((emp.deductions || 0) * 0.1).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>Special Allowance</td>
                  <td>${((emp.allowances || 0) * 0.3).toLocaleString('en-IN')}</td>
                  <td>Additional Deductions</td>
                  <td>${(processedPayroll.additionalDeductions || 0).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>Bonus</td>
                  <td>${(processedPayroll.bonusAmount || 0).toLocaleString('en-IN')}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="total">
                  <td><strong>Total Earnings</strong></td>
                  <td>${((emp.basicSalary || 0) + (emp.allowances || 0) + (processedPayroll.bonusAmount || 0)).toLocaleString('en-IN')}</td>
                  <td><strong>Total Deductions</strong></td>
                  <td>${((emp.deductions || 0) + (processedPayroll.additionalDeductions || 0)).toLocaleString('en-IN')}</td>
                </tr>
                <tr class="total">
                  <td colspan="3"><strong>Net Pay</strong></td>
                  <td><strong>${emp.netSalary?.toLocaleString('en-IN') || '0'}</strong></td>
                </tr>
              </table>
              
              <div style="margin-top: 30px;">
                <div><strong>Bank Details:</strong></div>
                <div>Bank Name: ${emp.bankDetails?.bankName || 'N/A'}</div>
                <div>Account Number: ${emp.bankDetails?.accountNumber || 'N/A'}</div>
                <div>IFSC Code: ${emp.bankDetails?.ifscCode || 'N/A'}</div>
              </div>
              
              <div style="margin-top: 30px; text-align: right;">
                <div style="border-top: 1px solid #000; width: 200px; display: inline-block; padding-top: 5px;">
                  Authorized Signatory
                </div>
              </div>
            </div>
          `).join('')}
          
          <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; cursor: pointer; margin: 20px auto; display: block;">
            Print All Payslips
          </button>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // View payroll record details
  const viewPayrollRecord = (record) => {
    setCurrentPayroll({
      ...record,
      selectedEmployees: record.details.map(detail => ({
        ...detail,
        hra: (detail.allowances || 0) * 0.4,
        da: (detail.allowances || 0) * 0.3,
        specialAllowance: (detail.allowances || 0) * 0.3,
        pf: (detail.deductions || 0) * 0.6,
        tax: (detail.deductions || 0) * 0.3,
        tds: (detail.deductions || 0) * 0.1
      }))
    });
    setIsPreviewModalOpen(true);
  };

  // Loading state
  if (!employees || !Array.isArray(employees)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-700">Loading employee data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-4">
        <button 
          onClick={() => setPayrollTab('processing')}
          className={`px-4 py-2 rounded-md transition-colors ${
            payrollTab === 'processing' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Process Payroll
        </button>
        <button 
          onClick={() => setPayrollTab('records')}
          className={`px-4 py-2 rounded-md transition-colors ${
            payrollTab === 'records' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Payroll Records
        </button>
      </div>

      {/* Payroll Processing Tab */}
      {payrollTab === 'processing' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Process Monthly Payroll</h2>
          
          {/* Payroll Period Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period Start*</label>
              <input 
                type="date" 
                name="payPeriodStart"
                value={payrollData.payPeriodStart}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period End*</label>
              <input 
                type="date" 
                name="payPeriodEnd"
                value={payrollData.payPeriodEnd}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date*</label>
              <input 
                type="date" 
                name="paymentDate"
                value={payrollData.paymentDate}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Amount (₹)</label>
              <input 
                type="number" 
                name="bonusAmount"
                value={payrollData.bonusAmount}
                onChange={handleInputChange}
                min="0"
                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Deductions (₹)</label>
              <input 
                type="number" 
                name="deductions"
                value={payrollData.deductions}
                onChange={handleInputChange}
                min="0"
                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input 
                type="text" 
                name="notes"
                value={payrollData.notes}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>

          {/* Employee Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-medium">Employee List</h3>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                        onChange={() => {
                          if (selectedEmployees.length === filteredEmployees.length) {
                            setSelectedEmployees([]);
                          } else {
                            setSelectedEmployees(filteredEmployees.map(emp => emp.id));
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="rounded text-blue-600 focus:ring-blue-500"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => toggleEmployeeSelection(employee.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{employee.basicSalary?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            employee.status === "Active" ? "bg-green-100 text-green-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => viewEmployeeDetails(employee)}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <FiEye className="mr-1" /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              onClick={handleProcessPayroll}
              disabled={selectedEmployees.length === 0}
              className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                selectedEmployees.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <FiDollarSign className="mr-2" /> Process Payroll
            </button>
            <button 
              onClick={handleExportForBank}
              disabled={!processedPayroll}
              className={`px-4 py-2 border rounded-md flex items-center transition-colors ${
                !processedPayroll
                  ? 'bg-gray-100 cursor-not-allowed text-gray-400' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <FiDownload className="mr-2" /> Export for Bank
            </button>
            <button 
              onClick={handlePrintPayslips}
              disabled={!processedPayroll}
              className={`px-4 py-2 border rounded-md flex items-center transition-colors ${
                !processedPayroll
                  ? 'bg-gray-100 cursor-not-allowed text-gray-400' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <FiPrinter className="mr-2" /> Print Payslips
            </button>
          </div>
        </div>
      )}

      {/* Payroll Records Tab */}
      {payrollTab === 'records' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
            <h2 className="font-semibold text-lg">Payroll History</h2>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
              <select className="border rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option>Last 6 Months</option>
                <option>This Financial Year</option>
                <option>Last Financial Year</option>
                <option>All Records</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center justify-center hover:bg-blue-700 transition-colors">
                <FiDownload className="mr-2" /> Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollRecords.length > 0 ? (
                  payrollRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.month}</div>
                        <div className="text-xs text-gray-500">
                          {record.payPeriodStart} to {record.payPeriodEnd}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          record.status === "Processed" ? "bg-green-100 text-green-800" :
                          record.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.employees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ₹{typeof record.total === 'number' ? record.total.toLocaleString('en-IN') : record.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.paymentDate || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                          onClick={() => viewPayrollRecord(record)}
                        >
                          <FiEye className="mr-1" /> View
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-800 flex items-center text-sm"
                          onClick={() => {
                            setProcessedPayroll(record);
                            handlePrintPayslips();
                          }}
                        >
                          <FiFileText className="mr-1" /> Payslips
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                          onClick={() => {
                            setProcessedPayroll(record);
                            handleExportForBank();
                          }}
                        >
                          <FiDownload className="mr-1" /> Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No payroll records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {isEmployeeDetailOpen && currentEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800">Employee Details</h2>
                <button 
                  onClick={() => setIsEmployeeDetailOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {currentEmployee.name}</p>
                    <p><span className="font-medium">Position:</span> {currentEmployee.position}</p>
                    <p><span className="font-medium">Department:</span> {currentEmployee.department}</p>
                    <p><span className="font-medium">Joining Date:</span> {currentEmployee.joinDate}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        currentEmployee.status === "Active" ? "bg-green-100 text-green-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {currentEmployee.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Email:</span> {currentEmployee.email}</p>
                    <p><span className="font-medium">Phone:</span> {currentEmployee.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Salary Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Basic Salary:</span> ₹{currentEmployee.basicSalary?.toLocaleString('en-IN')}</p>
                    <p><span className="font-medium">HRA:</span> ₹{currentEmployee.hra?.toLocaleString('en-IN')}</p>
                    <p><span className="font-medium">DA:</span> ₹{currentEmployee.da?.toLocaleString('en-IN')}</p>
                    <p><span className="font-medium">Special Allowance:</span> ₹{currentEmployee.specialAllowance?.toLocaleString('en-IN')}</p>
                    <p><span className="font-medium">PF:</span> ₹{currentEmployee.pf?.toLocaleString('en-IN')}</p>
                    <p><span className="font-medium">Tax:</span> ₹{currentEmployee.tax?.toLocaleString('en-IN')}</p>
                    <p><span className="font-medium">TDS:</span> ₹{currentEmployee.tds?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Bank Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Bank Name:</span> {currentEmployee.bankName}</p>
                    <p><span className="font-medium">Account Number:</span> {currentEmployee.accountNumber}</p>
                    <p><span className="font-medium">IFSC Code:</span> {currentEmployee.ifscCode}</p>
                    <p><span className="font-medium">PAN Number:</span> {currentEmployee.panNumber}</p>
                    <p><span className="font-medium">UAN Number:</span> {currentEmployee.uanNumber}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Leave Balance</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Casual Leave:</span> {currentEmployee.leaveBalances?.casualLeave?.remaining}/{currentEmployee.leaveBalances?.casualLeave?.total}</p>
                    <p><span className="font-medium">Sick Leave:</span> {currentEmployee.leaveBalances?.sickLeave?.remaining}/{currentEmployee.leaveBalances?.sickLeave?.total}</p>
                    <p><span className="font-medium">Earned Leave:</span> {currentEmployee.leaveBalances?.earnedLeave?.remaining}/{currentEmployee.leaveBalances?.earnedLeave?.total}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && processedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Payroll Processed Successfully!</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>The payroll for {processedPayroll.employees} employees has been processed.</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="mt-4">
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="font-medium text-blue-800">Total Amount: ₹{typeof processedPayroll.total === 'number' ? 
                  processedPayroll.total.toLocaleString('en-IN') : 
                  processedPayroll.total}</p>
                <p className="text-sm text-blue-700 mt-1">Payment Date: {processedPayroll.paymentDate}</p>
              </div>
              
              <div className="mt-4">
                <button 
                  onClick={() => setShowEmployeeNames(!showEmployeeNames)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showEmployeeNames ? 'Hide' : 'Show'} Employee List
                </button>
                
                {showEmployeeNames && (
                  <div className="mt-2 max-h-60 overflow-y-auto border rounded-md p-2">
                    <ul className="divide-y divide-gray-200">
                      {processedPayroll.details.map((emp, index) => (
                        <li key={index} className="py-2 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-sm text-gray-500">{emp.department}</p>
                          </div>
                          <span className="text-sm font-medium">
                            ₹{emp.netSalary.toLocaleString('en-IN')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setPayrollTab('records');
                }}
              >
                <FiEye className="mr-2" /> View Records
              </button>
              <button
                type="button"
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  handlePrintPayslips();
                }}
              >
                <FiPrinter className="mr-2" /> Print Payslips
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center col-span-2"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  handleExportForBank();
                }}
              >
                <FiDownload className="mr-2" /> Export for Bank Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && currentPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {currentPayroll.id ? `Payroll Details - ${currentPayroll.month}` : 'Payroll Preview'}
                </h2>
                <button 
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="border p-3 rounded bg-gray-50">
                    <p className="text-sm text-gray-500">Total Employees</p>
                    <p className="font-bold text-lg">{currentPayroll.employees}</p>
                  </div>
                  <div className="border p-3 rounded bg-gray-50">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-bold text-lg">₹{typeof currentPayroll.totalAmount === 'number' ? 
                      currentPayroll.totalAmount.toLocaleString('en-IN') : 
                      currentPayroll.totalAmount}</p>
                  </div>
                  <div className="border p-3 rounded bg-gray-50">
                    <p className="text-sm text-gray-500">Payment Date</p>
                    <p className="font-bold text-lg">{currentPayroll.paymentDate}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-3 rounded bg-gray-50">
                    <p className="text-sm text-gray-500">Pay Period</p>
                    <p className="font-medium">{currentPayroll.payPeriodStart} to {currentPayroll.payPeriodEnd}</p>
                  </div>
                  <div className="border p-3 rounded bg-gray-50">
  <p className="text-sm text-gray-500">Total Bonus</p>
  <p className="font-medium">
    ₹{(currentPayroll?.bonusAmount ?? 0).toLocaleString('en-IN')}
  </p>
</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Employee Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Net Pay</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(currentPayroll.details || currentPayroll.selectedEmployees).map((emp, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{emp.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{emp.position}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{emp.department}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                            ₹{calculateNetSalary(emp).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              emp.status === "Paid" ? "bg-green-100 text-green-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {emp.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                {!currentPayroll.id && (
                  <>
                    <button 
                      onClick={() => setIsPreviewModalOpen(false)}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmProcessPayroll}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Confirm & Process
                    </button>
                  </>
                )}
                {currentPayroll.id && (
                  <>
                    <button 
                      onClick={() => {
                        setProcessedPayroll(currentPayroll);
                        handleExportForBank();
                      }}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <FiDownload className="mr-2" /> Export
                    </button>
                    <button 
                      onClick={() => {
                        setProcessedPayroll(currentPayroll);
                        handlePrintPayslips();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <FiPrinter className="mr-2" /> Print Payslips
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;