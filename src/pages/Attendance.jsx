import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { 
  FiClock, FiUserCheck, FiUserX, FiCalendar, 
  FiDownload, FiFilter, FiSearch, FiCheck, FiX,
  FiPlus, FiEdit2, FiTrash2
} from 'react-icons/fi';
import AttendanceStats from '../components/AttendanceStats';
import AttendanceCharts from '../components/AttendanceCharts';
import LeaveRequests from '../components/LeaveRequests';
import TimeCorrectionRequests from '../components/TimeCorrectionRequests';
import ShiftManagement from '../components/ShiftManagement';
import DailyAttendance from '../components/DailyAttendance';
import MonthlyAttendance from '../components/MonthlyAttendance';

const Attendance = () => {
    const [userData, setUserData] = useState(null);
    const [timeCorrectionRequests, setTimeCorrectionRequests] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [shifts, setShifts] = useState([
        { id: 1, name: 'Morning', start: '09:00', end: '17:00', employees: [1, 2, 3, 4, 6, 8, 12, 15, 21, 22, 25, 28] },
        { id: 2, name: 'Evening', start: '14:00', end: '22:00', employees: [5, 7, 9, 11, 14, 18, 23, 26, 29] },
        { id: 3, name: 'Night', start: '22:00', end: '06:00', employees: [10, 13, 16, 17, 19, 20, 24, 27, 30] }
    ]);

    const [employees, setEmployees] = useState([
        { id: 1, fullName: 'Rajesh Deshmukh', position: 'CEO', department: 'Executive' },
        { id: 2, fullName: 'Priya Joshi', position: 'CFO', department: 'Finance' },
        { id: 3, fullName: 'Amit Kulkarni', position: 'CTO', department: 'Technology' },
        { id: 4, fullName: 'Neha Patil', position: 'VP Engineering', department: 'Technology' },
        { id: 5, fullName: 'Vikram Chavan', position: 'Senior Developer', department: 'Technology' },
        { id: 6, fullName: 'Ananya Pawar', position: 'HR Director', department: 'HR' },
        { id: 7, fullName: 'Rahul Thakur', position: 'Recruitment Manager', department: 'HR' },
        { id: 8, fullName: 'Divya More', position: 'Finance Manager', department: 'Finance' },
        { id: 9, fullName: 'Arjun Jadhav', position: 'Marketing Director', department: 'Marketing' },
        { id: 10, fullName: 'Meera Shinde', position: 'Sales Manager', department: 'Sales' },
        { id: 11, fullName: 'Karthik Gaikwad', position: 'UX Designer', department: 'Design' },
        { id: 12, fullName: 'Shreya Salvi', position: 'Product Manager', department: 'Product' },
        { id: 13, fullName: 'Aditya Rane', position: 'Data Scientist', department: 'Technology' },
        { id: 14, fullName: 'Pooja Deshpande', position: 'HR Specialist', department: 'HR' },
        { id: 15, fullName: 'Sanjay Bhor', position: 'Accountant', department: 'Finance' },
        { id: 16, fullName: 'Anjali Mhatre', position: 'Frontend Developer', department: 'Technology' },
        { id: 17, fullName: 'Rohit Naik', position: 'Backend Developer', department: 'Technology' },
        { id: 18, fullName: 'Nandini Kale', position: 'Marketing Specialist', department: 'Marketing' },
        { id: 19, fullName: 'Vivek Sawant', position: 'Sales Representative', department: 'Sales' },
        { id: 20, fullName: 'Ishaani Wagh', position: 'UI Designer', department: 'Design' },
        { id: 21, fullName: 'Suresh Iyer', position: 'QA Engineer', department: 'Technology' },
        { id: 22, fullName: 'Deepa Menon', position: 'DevOps Engineer', department: 'Technology' },
        { id: 23, fullName: 'Manoj Pillai', position: 'HR Associate', department: 'HR' },
        { id: 24, fullName: 'Lata Nair', position: 'Customer Support', department: 'Operations' },
        { id: 25, fullName: 'Ganesh Rao', position: 'Business Analyst', department: 'Product' },
        { id: 26, fullName: 'Anita Reddy', position: 'Content Writer', department: 'Marketing' },
        { id: 27, fullName: 'Prakash Kumar', position: 'Network Engineer', department: 'IT' },
        { id: 28, fullName: 'Sunita Gupta', position: 'Executive Assistant', department: 'Admin' },
        { id: 29, fullName: 'Harish Patel', position: 'Sales Executive', department: 'Sales' },
        { id: 30, fullName: 'Rina Shah', position: 'Graphic Designer', department: 'Design' }
    ]);

    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showAddShiftModal, setShowAddShiftModal] = useState(false);
    const [showRequestLeaveModal, setShowRequestLeaveModal] = useState(false);
    const [newShift, setNewShift] = useState({ name: '', start: '', end: '', employees: [] });
    const [newLeaveRequest, setNewLeaveRequest] = useState({
        employeeId: '',
        leaveType: 'Casual',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const navigate = useNavigate();

    // Generate dummy attendance data
    const generateAttendanceData = () => {
        const today = new Date().toISOString().split('T')[0];
        const records = employees.map(employee => {
            const isPresent = Math.random() > 0.1; // 90% chance of being present
            const isLate = isPresent && Math.random() > 0.7; // 30% chance of being late if present
            
            const shift = shifts.find(s => s.employees.includes(employee.id))?.name || 'Morning';
            
            let checkIn = '--:--';
            let checkOut = '--:--';
            
            if (isPresent) {
                // Generate check-in time based on shift with possible lateness
                const shiftStart = shifts.find(s => s.name === shift)?.start || '09:00';
                const [hours, minutes] = shiftStart.split(':').map(Number);
                const baseTime = new Date();
                baseTime.setHours(hours, minutes, 0, 0);
                
                if (isLate) {
                    // Add random lateness between 5-60 minutes
                    const lateMinutes = 5 + Math.floor(Math.random() * 55);
                    baseTime.setMinutes(baseTime.getMinutes() + lateMinutes);
                }
                
                checkIn = baseTime.toTimeString().substring(0, 5);
                
                // Generate check-out time (7-9 hours after check-in)
                const workHours = 7 + Math.floor(Math.random() * 3);
                baseTime.setHours(baseTime.getHours() + workHours);
                checkOut = baseTime.toTimeString().substring(0, 5);
            }
            
            return {
                id: employee.id,
                employeeId: employee.id,
                name: employee.fullName,
                position: employee.position,
                department: employee.department,
                date: today,
                status: isPresent ? 'present' : 'absent',
                checkIn,
                checkOut,
                shift,
                late: isLate,
                notes: isLate ? 'Arrived late to work' : ''
            };
        });
        
        setAttendanceRecords(records);
        setFilterDate(today);
    };

    // Generate some sample leave requests
    const generateLeaveRequests = () => {
        const requests = [
            {
                id: 1,
                employeeId: 5,
                employeeName: 'Vikram Chavan',
                department: 'Technology',
                leaveType: 'Sick',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 86400000).toISOString(), // +1 day
                reason: 'Fever and cold',
                status: 'pending'
            },
            {
                id: 2,
                employeeId: 12,
                employeeName: 'Shreya Salvi',
                department: 'Product',
                leaveType: 'Casual',
                startDate: new Date(Date.now() + 2 * 86400000).toISOString(), // +2 days
                endDate: new Date(Date.now() + 3 * 86400000).toISOString(), // +3 days
                reason: 'Family function',
                status: 'pending'
            },
            {
                id: 3,
                employeeId: 18,
                employeeName: 'Nandini Kale',
                department: 'Marketing',
                leaveType: 'Annual',
                startDate: new Date(Date.now() - 86400000).toISOString(), // -1 day
                endDate: new Date().toISOString(),
                reason: 'Vacation',
                status: 'approved'
            }
        ];
        setLeaveRequests(requests);
    };

    // Generate some sample time correction requests
    const generateTimeCorrectionRequests = () => {
        const requests = [
            {
                id: 1,
                employeeId: 7,
                employeeName: 'Rahul Thakur',
                department: 'HR',
                date: new Date().toISOString().split('T')[0],
                currentCheckIn: '09:15',
                currentCheckOut: '18:30',
                requestedCheckIn: '09:00',
                requestedCheckOut: '18:30',
                reason: 'Forgot to check in on time',
                status: 'pending'
            },
            {
                id: 2,
                employeeId: 14,
                employeeName: 'Pooja Deshpande',
                department: 'HR',
                date: new Date().toISOString().split('T')[0],
                currentCheckIn: '14:20',
                currentCheckOut: '22:00',
                requestedCheckIn: '14:00',
                requestedCheckOut: '22:00',
                reason: 'System issue during check-in',
                status: 'pending'
            },
            {
                id: 3,
                employeeId: 5,
                employeeName: 'Vikram Chavan',
                department: 'Technology',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
                currentCheckIn: '09:45',
                currentCheckOut: '18:15',
                requestedCheckIn: '09:30',
                requestedCheckOut: '18:15',
                reason: 'Traffic delay',
                status: 'approved'
            }
        ];
        setTimeCorrectionRequests(requests);
    };

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
        generateAttendanceData();
        generateLeaveRequests();
        generateTimeCorrectionRequests();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const openModal = () => console.log("Open profile modal");

    const handleTimeCorrection = (requestId, action) => {
        setTimeCorrectionRequests(prev => 
            prev.map(request => {
                if (request.id === requestId) {
                    if (action === 'approved') {
                        // Update attendance records if approved
                        setAttendanceRecords(prevRecords => 
                            prevRecords.map(record => 
                                record.id === request.employeeId && record.date === request.date ? {
                                    ...record,
                                    checkIn: request.requestedCheckIn,
                                    checkOut: request.requestedCheckOut,
                                    corrected: true
                                } : record
                            )
                        );
                    }
                    return {
                        ...request,
                        status: action
                    };
                }
                return request;
            })
        );
    };
    const handleLeaveAction = (requestId, action) => {
        setLeaveRequests(prev => 
            prev.map(request => 
                request.id === requestId ? { ...request, status: action } : request
            )
        );
    };

    const handleAddShift = () => {
        const newId = shifts.length > 0 ? Math.max(...shifts.map(s => s.id)) + 1 : 1;
        setShifts([...shifts, { ...newShift, id: newId }]);
        setShowAddShiftModal(false);
        setNewShift({ name: '', start: '', end: '', employees: [] });
    };

    const handleRequestLeave = () => {
        const newId = leaveRequests.length > 0 ? Math.max(...leaveRequests.map(l => l.id)) + 1 : 1;
        const employee = employees.find(e => e.id === parseInt(newLeaveRequest.employeeId));
        
        setLeaveRequests([...leaveRequests, {
            id: newId,
            employeeId: parseInt(newLeaveRequest.employeeId),
            employeeName: employee.fullName,
            department: employee.department,
            leaveType: newLeaveRequest.leaveType,
            startDate: newLeaveRequest.startDate,
            endDate: newLeaveRequest.endDate,
            reason: newLeaveRequest.reason,
            status: 'pending'
        }]);
        
        setShowRequestLeaveModal(false);
        setNewLeaveRequest({
            employeeId: '',
            leaveType: 'Casual',
            startDate: '',
            endDate: '',
            reason: ''
        });
    };

    const handleShiftEmployeeToggle = (employeeId, shiftId) => {
        setShifts(shifts.map(shift => {
            if (shift.id === shiftId) {
                if (shift.employees.includes(employeeId)) {
                    return {
                        ...shift,
                        employees: shift.employees.filter(id => id !== employeeId)
                    };
                } else {
                    return {
                        ...shift,
                        employees: [...shift.employees, employeeId]
                    };
                }
            }
            return shift;
        }));
    };

    const filteredRecords = attendanceRecords.filter(record => 
        (record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
        record.date === filterDate
    );

    // Calculate stats from filtered records
    const presentCount = filteredRecords.filter(r => r.status === 'present').length;
    const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
    const lateCount = filteredRecords.filter(r => r.late).length;

    const exportToCSV = () => {
        const headers = ['Employee ID', 'Name', 'Position', 'Department', 'Date', 'Status', 'Check In', 'Check Out', 'Shift', 'Notes'];
        const csvContent = [
            headers.join(','),
            ...filteredRecords.map(record => [
                record.employeeId,
                `"${record.name}"`,
                `"${record.position}"`,
                record.department,
                record.date,
                record.status,
                record.checkIn,
                record.checkOut,
                record.shift,
                `"${record.notes || ''}"`
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_${filterDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar userData={userData} handleLogout={handleLogout} openModal={openModal} />
            
            <div className="flex-1">
                <Navbar />
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-blue-700">Attendance Management</h1>
                        <div className="flex items-center space-x-4">
                            {/* <button 
                                onClick={() => setShowRequestLeaveModal(true)}
                                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                <FiPlus className="mr-2" /> Request Leave
                            </button> */}
                            <button 
                                onClick={exportToCSV}
                                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                            >
                                <FiDownload className="mr-2" /> Export
                            </button>
                        </div>
                    </div>
                    
                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <div className="relative">
                                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search employees..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full"
                                    />
                                </div>
                            </div>
                            {/* <div className="flex items-end">
                                <select 
                                    value={selectedEmployee || ''}
                                    onChange={(e) => setSelectedEmployee(e.target.value ? parseInt(e.target.value) : null)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                >
                                    <option value="">All Employees</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                                    ))}
                                </select>
                            </div> */}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <AttendanceStats 
                        totalEmployees={employees.length}
                        presentCount={presentCount}
                        absentCount={absentCount}
                        lateCount={lateCount}
                    />

                    {/* Attendance Charts */}
                    <AttendanceCharts 
                        presentCount={presentCount}
                        absentCount={absentCount}
                        lateCount={lateCount}
                    />

                    {/* Leave Approval Section */}
                    {leaveRequests.length > 0 && (
                        <LeaveRequests 
                            leaveRequests={leaveRequests}
                            handleLeaveAction={handleLeaveAction}
                        />
                    )}

                    {/* Time Correction Requests */}
                    {timeCorrectionRequests.length > 0 && (
                        <TimeCorrectionRequests 
                            timeCorrectionRequests={timeCorrectionRequests}
                            handleTimeCorrection={handleTimeCorrection}
                        />
                    )}

                    {/* Shifts Table */}
                    <ShiftManagement 
                        shifts={shifts}
                        employees={employees}
                        onEmployeeToggle={handleShiftEmployeeToggle}
                        onAddShift={() => setShowAddShiftModal(true)}
                    />

                    {/* Daily Attendance Table */}
                    <DailyAttendance 
                        attendanceRecords={filteredRecords}
                        filterDate={filterDate}
                        searchTerm={searchTerm}
                    />
                     {/* Monthly Attendance Report */}
                    <MonthlyAttendance 
                       attendanceRecords={attendanceRecords}
                       employees={employees}
                     />
                    {/* Add Shift Modal */}
                    {showAddShiftModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                                <h3 className="text-lg font-medium mb-4">Add New Shift</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Shift Name</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={newShift.name}
                                            onChange={(e) => setNewShift({...newShift, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                            <input
                                                type="time"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                value={newShift.start}
                                                onChange={(e) => setNewShift({...newShift, start: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                            <input
                                                type="time"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                value={newShift.end}
                                                onChange={(e) => setNewShift({...newShift, end: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowAddShiftModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddShift}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Add Shift
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Request Leave Modal
                    {showRequestLeaveModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                                <h3 className="text-lg font-medium mb-4">Request Leave</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={newLeaveRequest.employeeId}
                                            onChange={(e) => setNewLeaveRequest({...newLeaveRequest, employeeId: e.target.value})}
                                        >
                                            <option value="">Select Employee</option>
                                            {employees.map(emp => (
                                                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            value={newLeaveRequest.leaveType}
                                            onChange={(e) => setNewLeaveRequest({...newLeaveRequest, leaveType: e.target.value})}
                                        >
                                            <option value="Casual">Casual Leave</option>
                                            <option value="Sick">Sick Leave</option>
                                            <option value="Annual">Annual Leave</option>
                                            <option value="Maternity">Maternity Leave</option>
                                            <option value="Paternity">Paternity Leave</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                value={newLeaveRequest.startDate}
                                                onChange={(e) => setNewLeaveRequest({...newLeaveRequest, startDate: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                value={newLeaveRequest.endDate}
                                                onChange={(e) => setNewLeaveRequest({...newLeaveRequest, endDate: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                        <textarea
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            rows="3"
                                            value={newLeaveRequest.reason}
                                            onChange={(e) => setNewLeaveRequest({...newLeaveRequest, reason: e.target.value})}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowRequestLeaveModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRequestLeave}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default Attendance;