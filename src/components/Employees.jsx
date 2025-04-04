import React, { useState } from 'react';
import { 
  FiUser, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, 
  FiPrinter, FiDownload, FiMail, FiPhone, FiCalendar, 
  FiDollarSign, FiCreditCard, FiPercent, FiFileText, 
  FiEye, FiEyeOff, FiHome, FiMapPin, FiBriefcase, FiX
} from 'react-icons/fi';

const Employees = ({ employees, onUpdateEmployee, onDeleteEmployee }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('details');
  const [showBankDetails, setShowBankDetails] = useState(false);

  // Toggle row expansion
  const toggleRowExpand = (id) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total salary
  const calculateTotalSalary = (employee) => {
    return (employee.basicSalary || 0) + 
           (employee.hra || 0) + 
           (employee.da || 0) + 
           (employee.specialAllowance || 0) - 
           (employee.pf || 0) - 
           (employee.tax || 0) - 
           (employee.tds || 0);
  };

  // Handle employee update
  const handleUpdateEmployee = (updatedData) => {
    if (onUpdateEmployee) {
      onUpdateEmployee(selectedEmployee.id, updatedData);
    }
    setSelectedEmployee(null);
  };

  // Handle employee delete
  const handleDeleteEmployee = (id) => {
    if (onDeleteEmployee) {
      onDeleteEmployee(id);
    }
  };

  // Handle download employee data
  const handleDownload = () => {
    const dataToExport = filteredEmployees.map(employee => ({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      status: employee.status,
      salary: calculateTotalSalary(employee),
      email: employee.email,
      phone: employee.phone,
      joinDate: employee.joinDate
    }));

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `employees_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handle print employee data
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printableContent = `
      <html>
        <head>
          <title>Employee Records</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            .print-info { text-align: center; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status-active { color: green; }
            .status-leave { color: orange; }
            .status-inactive { color: red; }
          </style>
        </head>
        <body>
          <h1>Employee Records</h1>
          <div class="print-info">
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Total Employees: ${filteredEmployees.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEmployees.map(employee => `
                <tr>
                  <td>${employee.id}</td>
                  <td>${employee.name}</td>
                  <td>${employee.position}</td>
                  <td>${employee.department}</td>
                  <td class="status-${employee.status.toLowerCase().replace(' ', '-')}">
                    ${employee.status}
                  </td>
                  <td>₹${calculateTotalSalary(employee).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printableContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="font-semibold text-lg">Employee Records</h2>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-8 pr-4 py-2 w-full border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiUser className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <button 
              className="p-2 border rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleDownload}
              title="Download Employee Data"
            >
              <FiDownload className="text-gray-600" />
            </button>
            <button 
              className="p-2 border rounded-md hover:bg-gray-100 transition-colors"
              onClick={handlePrint}
              title="Print Employee Data"
            >
              <FiPrinter className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map(employee => (
                <React.Fragment key={employee.id}>
                  <tr 
                    className={`hover:bg-gray-50 cursor-pointer ${expandedRows.includes(employee.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => toggleRowExpand(employee.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.position}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{calculateTotalSalary(employee).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        employee.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : employee.status === 'On Leave' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployee(employee);
                          }}
                          title="Edit Employee"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
                              handleDeleteEmployee(employee.id);
                            }
                          }}
                          title="Delete Employee"
                        >
                          <FiTrash2 />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 p-1 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployee(employee);
                            setViewMode('details');
                          }}
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 p-1 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpand(employee.id);
                          }}
                          title="Expand/Collapse"
                        >
                          {expandedRows.includes(employee.id) ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Details */}
                  {expandedRows.includes(employee.id) && (
                    <tr className="bg-blue-50">
                      <td colSpan="5" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <h3 className="font-medium flex items-center">
                              <FiUser className="mr-2 text-blue-600" />
                              Personal Details
                            </h3>
                            <div className="text-sm">
                              <p className="flex items-center">
                                <FiMail className="mr-2 text-gray-400" />
                                {employee.email}
                              </p>
                              <p className="flex items-center mt-1">
                                <FiPhone className="mr-2 text-gray-400" />
                                {employee.phone}
                              </p>
                              <p className="flex items-center mt-1">
                                <FiCalendar className="mr-2 text-gray-400" />
                                DOB: {employee.dob}
                              </p>
                              <p className="flex items-center mt-1">
                                <FiUser className="mr-2 text-gray-400" />
                                Gender: {employee.gender}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="font-medium flex items-center">
                              <FiBriefcase className="mr-2 text-blue-600" />
                              Employment Details
                            </h3>
                            <div className="text-sm">
                              <p className="flex items-center">
                                <FiCalendar className="mr-2 text-gray-400" />
                                Joined: {employee.joinDate}
                              </p>
                              <p className="flex items-center mt-1">
                                <FiDollarSign className="mr-2 text-gray-400" />
                                Salary: ₹{calculateTotalSalary(employee).toLocaleString('en-IN')}
                              </p>
                              <p className="flex items-center mt-1">
                                <FiFileText className="mr-2 text-gray-400" />
                                Employment Type: {employee.employmentType}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="font-medium flex items-center">
                              <FiHome className="mr-2 text-blue-600" />
                              Address & Financial
                            </h3>
                            <div className="text-sm">
                              <p className="flex items-start">
                                <FiMapPin className="mr-2 text-gray-400 mt-0.5" />
                                {employee.address}
                              </p>
                              <p className="flex items-center mt-2">
                                <FiCreditCard className="mr-2 text-gray-400" />
                                PAN: {employee.panNumber}
                              </p>
                              <p className="flex items-center mt-1">
                                <FiFileText className="mr-2 text-gray-400" />
                                UAN: {employee.uanNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Employee Details</h2>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setViewMode(viewMode === 'details' ? 'salary' : 'details')}
                    className="px-3 py-1 border rounded-md text-sm flex items-center hover:bg-gray-100 transition-colors"
                  >
                    {viewMode === 'details' ? (
                      <>
                        <FiDollarSign className="mr-2" />
                        Salary View
                      </>
                    ) : (
                      <>
                        <FiUser className="mr-2" />
                        Details View
                      </>
                    )}
                  </button>
                  <button 
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setSelectedEmployee(null)}
                  >
                    <FiX className="text-2xl" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="md:col-span-1">
                  <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl mb-4">
                      {selectedEmployee.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                    <p className="text-gray-600">{selectedEmployee.position}</p>
                    <p className="text-sm text-gray-500 mt-2">Employee ID: {selectedEmployee.id}</p>
                    
                    <div className="mt-6 w-full space-y-3">
                      <button className="w-full py-2 bg-blue-600 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
                        <FiMail />
                        <span>Send Email</span>
                      </button>
                      <button 
                        className="w-full py-2 border border-blue-600 text-blue-600 rounded-md flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors"
                        onClick={() => {
                          setViewMode('salary');
                        }}
                      >
                        <FiDollarSign />
                        <span>Edit Salary</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Details Section */}
                <div className="md:col-span-2">
                  {viewMode === 'details' ? (
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <FiUser className="mr-2 text-blue-600" />
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{selectedEmployee.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{selectedEmployee.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="font-medium">{selectedEmployee.dob}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium">{selectedEmployee.gender}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">
                              {selectedEmployee.address}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Employment Details */}
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <FiBriefcase className="mr-2 text-blue-600" />
                          Employment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">{selectedEmployee.department}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Position</p>
                            <p className="font-medium">{selectedEmployee.position}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Joining Date</p>
                            <p className="font-medium">{selectedEmployee.joinDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Employment Type</p>
                            <p className="font-medium">{selectedEmployee.employmentType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                selectedEmployee.status === 'Active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : selectedEmployee.status === 'On Leave' 
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {selectedEmployee.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Financial Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <FiCreditCard className="mr-2 text-blue-600" />
                          Financial Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">PAN Number</p>
                            <p className="font-medium">{selectedEmployee.panNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">UAN Number</p>
                            <p className="font-medium">{selectedEmployee.uanNumber}</p>
                          </div>
                          <div className="md:col-span-2">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-500">Bank Details</p>
                              <button 
                                onClick={() => setShowBankDetails(!showBankDetails)}
                                className="text-blue-600 text-sm flex items-center hover:text-blue-800 transition-colors"
                              >
                                {showBankDetails ? (
                                  <>
                                    <FiEyeOff className="mr-1" /> Hide
                                  </>
                                ) : (
                                  <>
                                    <FiEye className="mr-1" /> Show
                                  </>
                                )}
                              </button>
                            </div>
                            {showBankDetails && (
                              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Bank Name</p>
                                  <p className="font-medium">{selectedEmployee.bankName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Account Number</p>
                                  <p className="font-medium">
                                    {selectedEmployee.accountNumber}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">IFSC Code</p>
                                  <p className="font-medium">{selectedEmployee.ifscCode}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Salary Breakdown */}
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <FiDollarSign className="mr-2 text-blue-600" />
                          Salary Structure
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Basic Salary</p>
                            <input 
                              type="number" 
                              defaultValue={selectedEmployee.basicSalary || 0} 
                              className="w-full border-b border-gray-300 py-1 text-right font-medium"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">HRA</p>
                            <input 
                              type="number" 
                              defaultValue={selectedEmployee.hra || 0} 
                              className="w-full border-b border-gray-300 py-1 text-right font-medium"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">DA</p>
                            <input 
                              type="number" 
                              defaultValue={selectedEmployee.da || 0} 
                              className="w-full border-b border-gray-300 py-1 text-right font-medium"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Special Allowance</p>
                            <input 
                              type="number" 
                              defaultValue={selectedEmployee.specialAllowance || 0} 
                              className="w-full border-b border-gray-300 py-1 text-right font-medium"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Earnings</p>
                            <p className="font-medium text-right">
                              ₹{(
                                (selectedEmployee.basicSalary || 0) + 
                                (selectedEmployee.hra || 0) + 
                                (selectedEmployee.da || 0) +
                                (selectedEmployee.specialAllowance || 0)
                              ).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Deductions */}
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <FiPercent className="mr-2 text-blue-600" />
                          Deductions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">PF (12%)</p>
                            <input 
                              type="number" 
                              defaultValue={selectedEmployee.pf || 0} 
                              className="w-full border-b border-gray-300 py-1 text-right font-medium"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Professional Tax</p>
                            <input 
                              type="number" 
                              defaultValue={selectedEmployee.tax || 0} 
                              className="w-full border-b border-gray-300 py-1 text-right font-medium"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">TDS</p>
                            <input 
                              type="number" 
                              defaultValue={selectedEmployee.tds || 0} 
                              className="w-full border-b border-gray-300 py-1 text-right font-medium"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Deductions</p>
                            <p className="font-medium text-right">
                              ₹{(
                                (selectedEmployee.pf || 0) + 
                                (selectedEmployee.tax || 0) + 
                                (selectedEmployee.tds || 0)
                              ).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Net Salary */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <FiFileText className="mr-2 text-blue-600" />
                          Net Salary
                        </h3>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <p className="font-medium">Take Home Salary</p>
                            <p className="text-2xl font-bold">
                              ₹{calculateTotalSalary(selectedEmployee).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (viewMode === 'salary') {
                      const formInputs = document.querySelectorAll('input[type="number"]');
                      const updatedData = {
                        basicSalary: parseFloat(formInputs[0].value),
                        hra: parseFloat(formInputs[1].value),
                        da: parseFloat(formInputs[2].value),
                        specialAllowance: parseFloat(formInputs[3].value),
                        pf: parseFloat(formInputs[4].value),
                        tax: parseFloat(formInputs[5].value),
                        tds: parseFloat(formInputs[6].value)
                      };
                      handleUpdateEmployee(updatedData);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;