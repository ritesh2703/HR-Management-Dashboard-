import React, { useState } from 'react';
import { 
  FiDollarSign, 
  FiUsers, 
  FiCheckCircle, 
  FiClock,
  FiPieChart,
  FiAlertCircle,
  FiBarChart2,
  FiBell,
  FiDownload,
  FiFileText,
  FiX
} from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Dashboard = ({ payrollStats, payrollRecords, employees = [] }) => {
  // Calculate stats based on employee data
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const totalEmployees = employees.length || 1; // Avoid division by zero
  const regularStaffPercentage = Math.round((activeEmployees / totalEmployees) * 100);
  const payrollCompletionPercentage = 75; // Example value
  const pendingPayPercentage = 25; // Example value
  const taxCompletionPercentage = 68; // Example value

  // State for announcement popup
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Expense breakdown data for pie chart
  const expenseData = [
    { name: 'Base Salary', value: 320000, color: '#3B82F6' },
    { name: 'Overtime Pay', value: 75000, color: '#10B981' },
    { name: 'Bonuses', value: 25000, color: '#F59E0B' }
  ];

  // Data for bar chart
  const monthlyExpenseData = [
    { name: 'Apr', base: 320000, overtime: 75000, bonus: 25000 },
    { name: 'Mar', base: 320000, overtime: 70000, bonus: 25000 },
    { name: 'Feb', base: 310000, overtime: 60000, bonus: 22000 },
    { name: 'Jan', base: 300000, overtime: 50000, bonus: 20000 },
    { name: 'Dec', base: 290000, overtime: 48000, bonus: 18000 },
    { name: 'Nov', base: 280000, overtime: 46000, bonus: 16000 },
    { name: 'Oct', base: 275000, overtime: 45000, bonus: 15000 },
    { name: 'Sep', base: 270000, overtime: 43000, bonus: 14000 },
    { name: 'Aug', base: 265000, overtime: 42000, bonus: 13000 },
    { name: 'Jul', base: 260000, overtime: 40000, bonus: 12000 },
    { name: 'Jun', base: 255000, overtime: 39000, bonus: 11000 },
    { name: 'May', base: 250000, overtime: 37000, bonus: 10000 }
  ];
  
  // Announcements data
  const announcements = [
    {
      id: 1,
      title: "Tax Filing Deadline Approaching",
      message: "All employees must submit their tax documents by May 15th to avoid penalties.",
      date: "2025-04-01",
      priority: "high",
      icon: <FiAlertCircle className="text-red-500" />
    },
    {
      id: 3,
      title: "Payroll Schedule Change",
      message: "June payroll will be processed one week early due to holidays.",
      date: "2025-04-20",
      priority: "low",
      icon: <FiBell className="text-blue-500" />
    }
  ];

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowAnnouncementModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Employee Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-100/50 rounded-lg">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-800 font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-gray-800">{totalEmployees}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs">
              <span className="text-blue-600">Regular staff</span>
              <span className="font-semibold">{regularStaffPercentage}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5 mt-1">
              <div 
                className="h-1.5 rounded-full bg-blue-600" 
                style={{ width: `${regularStaffPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Payroll Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-sm border border-green-100">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-100/50 rounded-lg">
              <FiCheckCircle className="text-green-600 text-xl" />
            </div>
            <div className="text-right">
              <p className="text-xs text-green-800 font-medium">Payroll Processed</p>
              <p className="text-2xl font-bold text-gray-800">₹3,15,000</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs">
              <span className="text-green-600">Completion</span>
              <span className="font-semibold">{payrollCompletionPercentage}%</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-1.5 mt-1">
              <div 
                className="h-1.5 rounded-full bg-green-600" 
                style={{ width: `${payrollCompletionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pending Pay Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl shadow-sm border border-yellow-100">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-yellow-100/50 rounded-lg">
              <FiClock className="text-yellow-600 text-xl" />
            </div>
            <div className="text-right">
              <p className="text-xs text-yellow-800 font-medium">Pending Pay</p>
              <p className="text-2xl font-bold text-gray-800">₹1,05,000</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs">
              <span className="text-yellow-600">Awaiting approval</span>
              <span className="font-semibold">{pendingPayPercentage}%</span>
            </div>
            <div className="w-full bg-yellow-200 rounded-full h-1.5 mt-1">
              <div 
                className="h-1.5 rounded-full bg-yellow-600" 
                style={{ width: `${pendingPayPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tax Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl shadow-sm border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-100/50 rounded-lg">
              <FiPieChart className="text-purple-600 text-xl" />
            </div>
            <div className="text-right">
              <p className="text-xs text-purple-800 font-medium">Tax & Deductions</p>
              <p className="text-2xl font-bold text-gray-800">₹84,000</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs">
              <span className="text-purple-600">Completed</span>
              <span className="font-semibold">{taxCompletionPercentage}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-1.5 mt-1">
              <div 
                className="h-1.5 rounded-full bg-purple-600" 
                style={{ width: `${taxCompletionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Announcements Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll Expenses Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiPieChart className="mr-2 text-blue-600" />
            Payroll Expenses Breakdown
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            Total: ₹{expenseData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          </div>
        </div>

        {/* Announcements Icons */}
       {/* Announcements Section */}
       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiBell className="mr-2 text-purple-600" />
            Announcements
          </h2>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div 
                key={announcement.id} 
                className={`p-3 rounded-lg border-l-4 ${
                  announcement.priority === 'high' 
                    ? 'border-red-500 bg-red-50' 
                    : announcement.priority === 'medium' 
                      ? 'border-yellow-500 bg-yellow-50' 
                      : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    {announcement.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(announcement.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            View All Announcements
          </button>
        </div>

        {/* Monthly Expenses Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 lg:col-span-3">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiBarChart2 className="mr-2 text-blue-600" />
            Monthly Payroll Trend
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenseData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                />
                <Legend />
                <Bar dataKey="base" name="Base Salary" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overtime" name="Overtime Pay" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bonus" name="Bonuses" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payroll Activities Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Recent Payroll Activities</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {employee.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">ID: {employee.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{employee.position}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{employee.salary}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 15, 2025</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Announcement Modal */}
      {showAnnouncementModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowAnnouncementModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX className="text-xl" />
            </button>
            
            <div className="flex items-start mb-4">
              <div className="mt-1 mr-4">
                {selectedAnnouncement.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedAnnouncement.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(selectedAnnouncement.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{selectedAnnouncement.message}</p>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setShowAnnouncementModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;