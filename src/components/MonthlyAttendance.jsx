import React, { useState } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';

const MonthlyAttendance = ({ attendanceRecords, employees }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
    // Get all unique dates in the selected month
    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date).toISOString().split('T')[0]);
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const monthDates = getDaysInMonth(currentYear, currentMonth);
    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

    // Calculate attendance stats for each employee
    const employeeStats = employees.map(employee => {
        const employeeRecords = attendanceRecords.filter(record => 
            record.employeeId === employee.id && 
            monthDates.includes(record.date)
        );
        
        const presentDays = employeeRecords.filter(record => record.status === 'present').length;
        const absentDays = employeeRecords.filter(record => record.status === 'absent').length;
        const totalDays = monthDates.length;
        const workingDays = monthDates.filter(date => {
            const day = new Date(date).getDay();
            return day !== 0 && day !== 6; // Exclude weekends
        }).length;
        
        const attendancePercentage = workingDays > 0 
            ? Math.round((presentDays / workingDays) * 100) 
            : 0;

        return {
            id: employee.id,
            name: employee.fullName,
            position: employee.position,
            department: employee.department,
            presentDays,
            absentDays,
            workingDays,
            attendancePercentage,
            records: employeeRecords
        };
    });

    const changeMonth = (increment) => {
        const newDate = new Date(currentYear, currentMonth + increment, 1);
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
    };

    const exportToCSV = () => {
        const headers = ['Employee ID', 'Name', 'Position', 'Department', 'Present Days', 'Absent Days', 'Working Days', 'Attendance %'];
        const csvContent = [
            headers.join(','),
            ...employeeStats.map(employee => [
                employee.id,
                `"${employee.name}"`,
                `"${employee.position}"`,
                `"${employee.department}"`,
                employee.presentDays,
                employee.absentDays,
                employee.workingDays,
                employee.attendancePercentage
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `monthly_attendance_${monthName}_${currentYear}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Monthly Attendance Report</h2>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => changeMonth(-1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <FiChevronLeft className="text-gray-600" />
                    </button>
                    <div className="flex items-center">
                        <FiCalendar className="mr-2 text-gray-500" />
                        <span className="font-medium">
                            {monthName} {currentYear}
                        </span>
                    </div>
                    <button 
                        onClick={() => changeMonth(1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <FiChevronRight className="text-gray-600" />
                    </button>
                </div>
            </div>
            
            <div className="flex justify-end mb-4">
                <button
                    onClick={exportToCSV}
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                    <FiDownload className="mr-2" /> Export to CSV
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Days</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th> */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employeeStats.map((employee) => (
                            <tr key={employee.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 font-medium">
                                                {employee.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                            <div className="text-sm text-gray-500">{employee.position}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {employee.department}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                        {employee.presentDays}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                        {employee.absentDays}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {employee.workingDays}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                            <div 
                                                className={`h-2.5 rounded-full ${
                                                    employee.attendancePercentage >= 90 ? 'bg-green-500' :
                                                    employee.attendancePercentage >= 75 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                                style={{ width: `${employee.attendancePercentage}%` }}
                                            ></div>
                                        </div>
                                        <span>{employee.attendancePercentage}%</span>
                                    </div>
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900">
                                        View Details
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlyAttendance;