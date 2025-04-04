import React, { useState, useEffect } from 'react';
import { FiX, FiDollarSign, FiUsers, FiCalendar, FiFileText } from 'react-icons/fi';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import Employees from '../components/Employees';
import Payroll from '../components/Payroll';
import Reports from '../components/Reports';
import Analytics from '../components/Analytics1';

const PayrollPage = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Mock data
  const payrollStats = [
    { title: "Total Payroll", value: "₹4,20,000", icon: <FiDollarSign /> },
    { title: "Employees", value: "42", icon: <FiUsers /> },
    { title: "Upcoming Payments", value: "3", icon: <FiCalendar /> },
    { title: "Pending Approvals", value: "7", icon: <FiFileText /> }
  ];

  const employees = [
    {
      id: 1,
      name: "Rahul Patel",
      position: "Software Engineer",
      department: "Engineering",
      status: "Active",
      email: "rahul.patel@company.in",
      phone: "+91 9876543210",
      dob: "15/06/1990",
      gender: "Male",
      joinDate: "01/04/2020",
      employmentType: "Full-time",
      address: "123 MG Road, Bangalore, Karnataka 560001",
      basicSalary: 45000,
      hra: 18000,
      da: 9000,
      specialAllowance: 12000,
      pf: 5400,
      tax: 2500,
      tds: 4500,
      panNumber: "ABCDE1234F",
      uanNumber: "100123456789",
      bankName: "State Bank of India",
      accountNumber: "123456789012",
      ifscCode: "SBIN0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 3, remaining: 9 },
        sickLeave: { total: 10, taken: 2, remaining: 8 },
        earnedLeave: { total: 15, taken: 5, remaining: 10 }
      }
    },
    {
      id: 2,
      name: "Priyanka Singh",
      position: "Project Manager",
      department: "Engineering",
      status: "Active",
      email: "priyanka.singh@company.in",
      phone: "+91 9876543211",
      dob: "22/09/1985",
      gender: "Female",
      joinDate: "15/07/2018",
      employmentType: "Full-time",
      address: "456 Brigade Road, Bangalore, Karnataka 560001",
      basicSalary: 60000,
      hra: 24000,
      da: 12000,
      specialAllowance: 18000,
      pf: 7200,
      tax: 3000,
      tds: 7500,
      panNumber: "BCDEF2345G",
      uanNumber: "100234567890",
      bankName: "HDFC Bank",
      accountNumber: "234567890123",
      ifscCode: "HDFC0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 4, remaining: 8 },
        sickLeave: { total: 10, taken: 1, remaining: 9 },
        earnedLeave: { total: 15, taken: 7, remaining: 8 }
      }
    },
    {
      id: 3,
      name: "Arjun Kumar",
      position: "Senior Developer",
      department: "Engineering",
      status: "Active",
      email: "arjun.kumar@company.in",
      phone: "+91 9876543212",
      dob: "10/03/1992",
      gender: "Male",
      joinDate: "01/03/2021",
      employmentType: "Full-time",
      address: "789 Koramangala, Bangalore, Karnataka 560034",
      basicSalary: 50000,
      hra: 20000,
      da: 10000,
      specialAllowance: 15000,
      pf: 6000,
      tax: 2000,
      tds: 5000,
      panNumber: "CDEFG3456H",
      uanNumber: "100345678901",
      bankName: "ICICI Bank",
      accountNumber: "345678901234",
      ifscCode: "ICIC0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 2, remaining: 10 },
        sickLeave: { total: 10, taken: 3, remaining: 7 },
        earnedLeave: { total: 15, taken: 4, remaining: 11 }
      }
    },
    {
      id: 4,
      name: "Neha Sharma",
      position: "HR Manager",
      department: "HR",
      status: "Active",
      email: "neha.sharma@company.in",
      phone: "+91 9876543213",
      dob: "08/05/1987",
      gender: "Female",
      joinDate: "10/02/2019",
      employmentType: "Full-time",
      address: "101 HR Lane, Bangalore, Karnataka 560002",
      basicSalary: 52000,
      hra: 20800,
      da: 10400,
      specialAllowance: 12000,
      pf: 6240,
      tax: 2200,
      tds: 4600,
      panNumber: "EFGH1234I",
      uanNumber: "100456789012",
      bankName: "Axis Bank",
      accountNumber: "456789012345",
      ifscCode: "UTIB0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 1, remaining: 11 },
        sickLeave: { total: 10, taken: 1, remaining: 9 },
        earnedLeave: { total: 15, taken: 3, remaining: 12 }
      }
    },
    {
      id: 5,
      name: "Vikram Joshi",
      position: "Product Designer",
      department: "Design",
      status: "Active",
      email: "vikram.joshi@company.in",
      phone: "+91 9876543214",
      dob: "17/02/1991",
      gender: "Male",
      joinDate: "01/09/2020",
      employmentType: "Full-time",
      address: "222 Residency Road, Bangalore, Karnataka 560025",
      basicSalary: 44000,
      hra: 17600,
      da: 8800,
      specialAllowance: 11000,
      pf: 5280,
      tax: 1800,
      tds: 4000,
      panNumber: "FGHIJ4567K",
      uanNumber: "100567890123",
      bankName: "Canara Bank",
      accountNumber: "567890123456",
      ifscCode: "CNRB0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 2, remaining: 10 },
        sickLeave: { total: 10, taken: 0, remaining: 10 },
        earnedLeave: { total: 15, taken: 4, remaining: 11 }
      }
    },
    {
      id: 6,
      name: "Ananya Gupta",
      position: "Marketing Specialist",
      department: "Marketing",
      status: "Active",
      email: "ananya.gupta@company.in",
      phone: "+91 9876543215",
      dob: "03/12/1994",
      gender: "Female",
      joinDate: "01/05/2021",
      employmentType: "Full-time",
      address: "88 Lavelle Road, Bangalore, Karnataka 560001",
      basicSalary: 40000,
      hra: 16000,
      da: 8000,
      specialAllowance: 10000,
      pf: 4800,
      tax: 1500,
      tds: 3500,
      panNumber: "HIJKL5678M",
      uanNumber: "100678901234",
      bankName: "Yes Bank",
      accountNumber: "678901234567",
      ifscCode: "YESB0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 3, remaining: 9 },
        sickLeave: { total: 10, taken: 2, remaining: 8 },
        earnedLeave: { total: 15, taken: 5, remaining: 10 }
      }
    },
    {
      id: 7,
      name: "Rohan Mehta",
      position: "DevOps Engineer",
      department: "Engineering",
      status: "On Leave",
      email: "rohan.mehta@company.in",
      phone: "+91 9876543216",
      dob: "05/11/1988",
      gender: "Male",
      joinDate: "01/06/2020",
      employmentType: "Full-time",
      address: "321 Indiranagar, Bangalore, Karnataka 560038",
      basicSalary: 55000,
      hra: 22000,
      da: 11000,
      specialAllowance: 16000,
      pf: 6600,
      tax: 2500,
      tds: 6000,
      panNumber: "GHIJK5678L",
      uanNumber: "100567890123",
      bankName: "Axis Bank",
      accountNumber: "567890123456",
      ifscCode: "UTIB0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 6, remaining: 6 },
        sickLeave: { total: 10, taken: 4, remaining: 6 },
        earnedLeave: { total: 15, taken: 8, remaining: 7 }
      }
    },
    {
      id: 8,
      name: "Sneha Reddy",
      position: "Data Analyst",
      department: "Analytics",
      status: "Active",
      email: "sneha.reddy@company.in",
      phone: "+91 9876543217",
      dob: "27/10/1993",
      gender: "Female",
      joinDate: "01/02/2022",
      employmentType: "Full-time",
      address: "444 Rajajinagar, Bangalore, Karnataka 560010",
      basicSalary: 46000,
      hra: 18400,
      da: 9200,
      specialAllowance: 12000,
      pf: 5520,
      tax: 2000,
      tds: 4100,
      panNumber: "NOPQR7890S",
      uanNumber: "100789012345",
      bankName: "Federal Bank",
      accountNumber: "789012345678",
      ifscCode: "FDRL0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 1, remaining: 11 },
        sickLeave: { total: 10, taken: 0, remaining: 10 },
        earnedLeave: { total: 15, taken: 2, remaining: 13 }
      }
    },
    {
      id: 9,
      name: "Amit Desai",
      position: "QA Engineer",
      department: "Quality Assurance",
      status: "Active",
      email: "amit.desai@company.in",
      phone: "+91 9876543218",
      dob: "30/06/1990",
      gender: "Male",
      joinDate: "01/07/2021",
      employmentType: "Full-time",
      address: "999 Malleshwaram, Bangalore, Karnataka 560003",
      basicSalary: 38000,
      hra: 15200,
      da: 7600,
      specialAllowance: 10000,
      pf: 4560,
      tax: 1800,
      tds: 3800,
      panNumber: "STUVW8901X",
      uanNumber: "100890123456",
      bankName: "Punjab National Bank",
      accountNumber: "890123456789",
      ifscCode: "PUNB0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 3, remaining: 9 },
        sickLeave: { total: 10, taken: 1, remaining: 9 },
        earnedLeave: { total: 15, taken: 4, remaining: 11 }
      }
    },
    {
      id: 10,
      name: "Pooja Iyer",
      position: "Content Writer",
      department: "Marketing",
      status: "Active",
      email: "pooja.iyer@company.in",
      phone: "+91 9876543219",
      dob: "19/08/1995",
      gender: "Female",
      joinDate: "15/08/2022",
      employmentType: "Full-time",
      address: "777 Marathahalli, Bangalore, Karnataka 560037",
      basicSalary: 36000,
      hra: 14400,
      da: 7200,
      specialAllowance: 9000,
      pf: 4320,
      tax: 1600,
      tds: 3500,
      panNumber: "UVWXY9012Z",
      uanNumber: "100901234567",
      bankName: "IDFC First Bank",
      accountNumber: "901234567890",
      ifscCode: "IDFB0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 2, remaining: 10 },
        sickLeave: { total: 10, taken: 1, remaining: 9 },
        earnedLeave: { total: 15, taken: 3, remaining: 12 }
      }
    },
    {
      id: 11,
      name: "Karthik Nair",
      position: "Technical Lead",
      department: "Engineering",
      status: "Active",
      email: "karthik.nair@company.in",
      phone: "+91 9876543220",
      dob: "12/04/1986",
      gender: "Male",
      joinDate: "01/01/2017",
      employmentType: "Full-time",
      address: "123 MG Layout, Bangalore, Karnataka 560001",
      basicSalary: 72000,
      hra: 28800,
      da: 14400,
      specialAllowance: 20000,
      pf: 8640,
      tax: 3200,
      tds: 8800,
      panNumber: "YZABC1234D",
      uanNumber: "100912345678",
      bankName: "Bank of Baroda",
      accountNumber: "912345678901",
      ifscCode: "BARB0BLR123",
      leaveBalances: {
        casualLeave: { total: 12, taken: 4, remaining: 8 },
        sickLeave: { total: 10, taken: 2, remaining: 8 },
        earnedLeave: { total: 15, taken: 6, remaining: 9 }
      }
    },
    {
      id: 12,
      name: "Divya Menon",
      position: "UX Designer",
      department: "Design",
      status: "On Leave",
      email: "divya.menon@company.in",
      phone: "+91 9876543221",
      dob: "18/07/1993",
      gender: "Female",
      joinDate: "15/09/2021",
      employmentType: "Full-time",
      address: "555 Whitefield, Bangalore, Karnataka 560066",
      basicSalary: 48000,
      hra: 19200,
      da: 9600,
      specialAllowance: 14000,
      pf: 5760,
      tax: 2000,
      tds: 4500,
      panNumber: "LMNOP6789Q",
      uanNumber: "100678901234",
      bankName: "Kotak Mahindra Bank",
      accountNumber: "678901234567",
      ifscCode: "KKBK0001234",
      leaveBalances: {
        casualLeave: { total: 12, taken: 5, remaining: 7 },
        sickLeave: { total: 10, taken: 2, remaining: 8 },
        earnedLeave: { total: 15, taken: 6, remaining: 9 }
      }
    }
  ];
  
  // Helper function to calculate total salary
  const calculateTotalSalary = (employee) => {
    return employee.basicSalary + employee.hra + employee.da + employee.specialAllowance - employee.pf - employee.tax - employee.tds;
  };
  
  // Add formatted salary to each employee
  employees.forEach(employee => {
    employee.salary = `₹${calculateTotalSalary(employee).toLocaleString('en-IN')}`;
  });
  const payrollRecords = [
    { month: "April 2025", status: "pending", total: "₹4,20,000", paymentDate: null, employees: 42 },
    { month: "March 2025", status: "Processed", total: "₹4,20,000", paymentDate: "2025-03-01", employees: 42 },
    { month: "February 2025", status: "Processed", total: "₹4,10,000", paymentDate: "2025-02-01", employees: 41 },
    { month: "January 2025", status: "Processed", total: "₹4,15,000", paymentDate: "2025-01-01", employees: 41 },
    { month: "December 2024", status: "Processed", total: "₹4,00,000", paymentDate: "2024-12-01", employees: 40 },
    { month: "November 2024", status: "Processed", total: "₹3,95,000", paymentDate: "2024-11-01", employees: 40 },
    { month: "October 2024", status: "Processed", total: "₹3,90,000", paymentDate: "2024-10-01", employees: 39 },
    { month: "September 2024", status: "Processed", total: "₹3,85,000", paymentDate: "2024-09-01", employees: 39 },
    { month: "August 2024", status: "Processed", total: "₹3,80,000", paymentDate: "2024-08-01", employees: 38 },
    { month: "July 2024", status: "Processed", total: "₹3,75,000", paymentDate: "2024-07-01", employees: 38 },
    { month: "June 2024", status: "Processed", total: "₹3,70,000", paymentDate: "2024-06-01", employees: 37 },
    { month: "May 2024", status: "Processed", total: "₹3,65,000", paymentDate: "2024-05-01", employees: 37 },
    { month: "April 2024", status: "Processed", total: "₹3,60,000", paymentDate: "2024-04-01", employees: 36 },
    { month: "March 2024", status: "Processed", total: "₹3,55,000", paymentDate: "2024-03-01", employees: 36 }
  ];
  
  

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        navigate('/login');
      }
    };

    fetchUserData();

    const interval = setInterval(() => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setDateTime(now.toLocaleDateString('en-US', options));
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar userData={userData} handleLogout={handleLogout} openModal={openModal} />
      <div className="flex-1">
        <Navbar />
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Payroll Management</h1>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Financial Year: 2025-26</p>
              <p className="text-sm text-black font-bold">{dateTime}</p>
            </div>
          </header>

          <nav className="flex space-x-4 mb-8 border-b">
            {['dashboard', 'employees', 'payroll', 'analytics', 'reports'].map((section) => (
              <button 
                key={section}
                onClick={() => setActiveSection(section)}
                className={`pb-2 px-4 capitalize ${activeSection === section ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                {section}
              </button>
            ))}
          </nav>

          {activeSection === 'dashboard' && (
            <Dashboard 
              payrollStats={payrollStats} 
              payrollRecords={payrollRecords} 
              employees={employees} 
            />
          )}
          {activeSection === 'employees' && (
            <Employees 
            employees={employees} 
            onUpdateEmployee={(id, updatedData) => {
              // Handle employee update logic here
              console.log(`Update employee ${id} with`, updatedData);
            }}
            onDeleteEmployee={(id) => {
              // Handle employee deletion logic here
              console.log(`Delete employee ${id}`);
            }}
          />
          )}
          {activeSection === 'payroll' && (
            <Payroll 
            employees={employees} 
            payrollRecords={payrollRecords} 
          />
          )}
          {activeSection === 'analytics' && (
             <Analytics employees={employees} />
          )}
          {activeSection === 'reports' && (
            <Reports employees={employees} payrollRecords={payrollRecords} />
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative bg-white p-4 rounded-lg shadow-md" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500" onClick={closeModal}>
              <FiX size={24} />
            </button>
            <img src={userData?.profileImage} alt="Enlarged Profile" className="max-w-[90vw] max-h-[80vh] rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;