import React, { useState, useEffect } from 'react';
import { FiUsers, FiList, FiGrid, FiGitBranch, FiPlus, FiSearch, FiPhone } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import OrgChart from '../components/OrgChart';
import AddEmployee from '../components/AddEmployee';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Employees = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([
    { 
      id: 1, 
      name: 'Rajesh Deshmukh', 
      position: 'CEO', 
      department: 'Executive', 
      email: 'rajesh.deshmukh@example.com', 
      phone: '+91 98765 43210',
      branch: 'HQ',
      joinDate: '2019-05-10',
      status: 'Active'
    },
    { 
      id: 2, 
      name: 'Priya Joshi', 
      position: 'CFO', 
      department: 'Finance', 
      email: 'priya.joshi@example.com',
      phone: '+91 87654 32109',
      branch: 'HQ', 
      reportsTo: 1,
      joinDate: '2020-02-15',
      status: 'Active'
    },
    { 
      id: 3, 
      name: 'Amit Kulkarni', 
      position: 'CTO', 
      department: 'Technology', 
      email: 'amit.kulkarni@example.com',
      phone: '+91 76543 21098',
      branch: 'HQ', 
      reportsTo: 1,
      joinDate: '2019-11-20',
      status: 'Active'
    },
    { 
      id: 4, 
      name: 'Neha Patil', 
      position: 'VP of Engineering', 
      department: 'Technology', 
      email: 'neha.patil@example.com',
      phone: '+91 65432 10987',
      branch: 'West', 
      reportsTo: 3,
      joinDate: '2020-07-12',
      status: 'Active'
    },
    { 
      id: 5, 
      name: 'Vikram Chavan', 
      position: 'Senior Developer', 
      department: 'Technology', 
      email: 'vikram.chavan@example.com',
      phone: '+91 94321 09876',
      branch: 'West', 
      reportsTo: 4,
      joinDate: '2021-03-05',
      status: 'Active'
    },
    { 
      id: 6, 
      name: 'Ananya Pawar', 
      position: 'HR Director', 
      department: 'HR', 
      email: 'ananya.pawar@example.com',
      phone: '+91 83210 98765',
      branch: 'HQ', 
      reportsTo: 1,
      joinDate: '2020-01-08',
      status: 'Active'
    },
    { 
      id: 7, 
      name: 'Rahul Thakur', 
      position: 'Recruitment Manager', 
      department: 'HR', 
      email: 'rahul.thakur@example.com',
      phone: '+91 72109 87654',
      branch: 'East', 
      reportsTo: 6,
      joinDate: '2021-09-14',
      status: 'Active'
    },
    { 
      id: 8, 
      name: 'Divya More', 
      position: 'Finance Manager', 
      department: 'Finance', 
      email: 'divya.more@example.com',
      phone: '+91 61098 76543',
      branch: 'HQ', 
      reportsTo: 2,
      joinDate: '2020-04-22',
      status: 'Active'
    },
    { 
      id: 9, 
      name: 'Arjun Jadhav', 
      position: 'Marketing Director', 
      department: 'Marketing', 
      email: 'arjun.jadhav@example.com',
      phone: '+91 50987 65432',
      branch: 'North', 
      reportsTo: 1,
      joinDate: '2020-06-15',
      status: 'Active'
    },
    { 
      id: 10, 
      name: 'Meera Shinde', 
      position: 'Sales Manager', 
      department: 'Sales', 
      email: 'meera.shinde@example.com',
      phone: '+91 49876 54321',
      branch: 'South', 
      reportsTo: 1,
      joinDate: '2020-08-30',
      status: 'Active'
    },
    { 
      id: 11, 
      name: 'Karthik Gaikwad', 
      position: 'UX Designer', 
      department: 'Design', 
      email: 'karthik.gaikwad@example.com',
      phone: '+91 38765 43210',
      branch: 'West', 
      reportsTo: 4,
      joinDate: '2021-01-10',
      status: 'Active'
    },
    { 
      id: 12, 
      name: 'Shreya Salvi', 
      position: 'Product Manager', 
      department: 'Product', 
      email: 'shreya.salvi@example.com',
      phone: '+91 27654 32109',
      branch: 'HQ', 
      reportsTo: 3,
      joinDate: '2020-11-05',
      status: 'Active'
    },
    { 
      id: 13, 
      name: 'Aditya Rane', 
      position: 'Data Scientist', 
      department: 'Technology', 
      email: 'aditya.rane@example.com',
      phone: '+91 16543 21098',
      branch: 'West', 
      reportsTo: 4,
      joinDate: '2021-05-20',
      status: 'Active'
    },
    { 
      id: 14, 
      name: 'Pooja Deshpande', 
      position: 'HR Specialist', 
      department: 'HR', 
      email: 'pooja.deshpande@example.com',
      phone: '+91 95432 10987',
      branch: 'East', 
      reportsTo: 6,
      joinDate: '2021-07-15',
      status: 'Active'
    },
    { 
      id: 15, 
      name: 'Sanjay Bhor', 
      position: 'Accountant', 
      department: 'Finance', 
      email: 'sanjay.bhor@example.com',
      phone: '+91 84321 09876',
      branch: 'HQ', 
      reportsTo: 2,
      joinDate: '2020-09-22',
      status: 'Active'
    },
    { 
      id: 16, 
      name: 'Anjali Mhatre', 
      position: 'Frontend Developer', 
      department: 'Technology', 
      email: 'anjali.mhatre@example.com',
      phone: '+91 73210 98765',
      branch: 'West', 
      reportsTo: 4,
      joinDate: '2021-02-18',
      status: 'Active'
    },
    { 
      id: 17, 
      name: 'Rohit Naik', 
      position: 'Backend Developer', 
      department: 'Technology', 
      email: 'rohit.naik@example.com',
      phone: '+91 62109 87654',
      branch: 'West', 
      reportsTo: 4,
      joinDate: '2021-04-30',
      status: 'Active'
    },
    { 
      id: 18, 
      name: 'Nandini Kale', 
      position: 'Marketing Specialist', 
      department: 'Marketing', 
      email: 'nandini.kale@example.com',
      phone: '+91 51098 76543',
      branch: 'North', 
      reportsTo: 9,
      joinDate: '2021-06-25',
      status: 'Active'
    },
    { 
      id: 19, 
      name: 'Vivek Sawant', 
      position: 'Sales Representative', 
      department: 'Sales', 
      email: 'vivek.sawant@example.com',
      phone: '+91 40987 65432',
      branch: 'South', 
      reportsTo: 10,
      joinDate: '2021-08-10',
      status: 'Active'
    },
    { 
      id: 20, 
      name: 'Ishaani Wagh', 
      position: 'UI Designer', 
      department: 'Design', 
      email: 'ishaani.wagh@example.com',
      phone: '+91 39876 54321',
      branch: 'West', 
      reportsTo: 11,
      joinDate: '2021-10-05',
      status: 'Active'
    }
  ]);

  // Fetch current user data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData({
            id: user.uid,
            email: user.email,
            ...docSnap.data()
          });
        } else {
          setUserData({
            id: user.uid,
            email: user.email,
            fullName: user.displayName || user.email.split('@')[0],
            role: 'User'
          });
        }
      } else {
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleAddEmployee = (newEmployee) => {
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    setEmployees([...employees, { ...newEmployee, id: newId }]);
    setShowAddEmployee(false);
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.phone && employee.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Function to render employee avatar with phone icon if no initials
  const renderEmployeeAvatar = (employee) => {
    if (!employee.name || employee.name.trim().length === 0) {
      return (
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-600">
          <FiPhone className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-600 font-medium">
        {employee.name.charAt(0)}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        userData={userData} 
        handleLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userData={userData} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiUsers className="mr-2" /> Employee Management
              <span className="ml-4 text-sm font-normal text-gray-500">
                (Total: {employees.length} employees)
              </span>
            </h1>
            <div className="flex space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setShowAddEmployee(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-2" /> Add Employee
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <FiList className="mr-2" /> List View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-4 py-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <FiGrid className="mr-2" /> Table View
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`flex items-center px-4 py-2 rounded-lg ${viewMode === 'tree' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <FiGitBranch className="mr-2" /> Org Chart
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>
          </div>

          {viewMode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map(employee => (
                <div key={employee.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    {renderEmployeeAvatar(employee)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                      <p className="text-xs text-gray-500 mt-1">{employee.department} • {employee.branch}</p>
                      <p className="text-xs text-blue-500 truncate">{employee.email}</p>
                      {employee.phone && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <FiPhone className="mr-1" /> {employee.phone}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {employee.status}
                        </span>
                        <span className="text-xs text-gray-500">Joined: {employee.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map(employee => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {employee.name && employee.name.trim().length > 0 ? (
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 font-medium">
                              {employee.name.charAt(0)}
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600">
                              <FiPhone className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-xs text-gray-500">{employee.branch}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-500">{employee.email}</div>
                        {employee.phone && (
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <FiPhone className="mr-1" /> {employee.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === 'tree' && (
            <OrgChart employees={filteredEmployees} />
          )}

          {showAddEmployee && (
            <AddEmployee 
              onClose={() => setShowAddEmployee(false)}
              onAddEmployee={handleAddEmployee}
              existingEmployees={employees}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Employees;