import React from 'react';
import { FiClock, FiUserCheck, FiUserX } from 'react-icons/fi';

const AttendanceStats = ({ totalEmployees, presentCount, absentCount, lateCount }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Total Employees</p>
                    <p className="text-2xl font-bold">{totalEmployees}</p>
                </div>
                <FiUserCheck className="text-blue-500 text-2xl" />
            </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Present Today</p>
                    <p className="text-2xl font-bold">{presentCount}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {Math.round((presentCount / totalEmployees) * 100)}% attendance
                    </p>
                </div>
                <FiUserCheck className="text-green-500 text-2xl" />
            </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Absent Today</p>
                    <p className="text-2xl font-bold">{absentCount}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {Math.round((absentCount / totalEmployees) * 100)}% absence
                    </p>
                </div>
                <FiUserX className="text-red-500 text-2xl" />
            </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Late Arrivals</p>
                    <p className="text-2xl font-bold">{lateCount}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {presentCount > 0 ? Math.round((lateCount / presentCount) * 100) : 0}% of present
                    </p>
                </div>
                <FiClock className="text-yellow-500 text-2xl" />
            </div>
        </div>
    </div>
);

export default AttendanceStats;