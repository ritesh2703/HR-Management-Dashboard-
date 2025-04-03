import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiClock, FiCalendar, FiHome, FiLogOut } from 'react-icons/fi';

const EmployeeSidebar = ({ userData, handleLogout, activeTab, setActiveTab, setShowLeaveForm, setShowTimeCorrectionForm }) => {
    return (
        <div className="w-64 bg-white shadow-lg border-r p-5 flex flex-col">
            {/* Header */}
            <div className="flex justify-center items-center mb-6">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-blue-700">Efficio</h1>
                    <hr className="my-2 border-gray-200" />
                </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4 mb-6">
                {userData?.profileImage && (
                    <img
                        src={userData.profileImage}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-blue-500"
                    />
                )}
                <div>
                    <h2 className="text-lg font-bold text-blue-600">
                        {userData?.fullName}
                        <span className="text-sm text-gray-500"> ({userData?.role})</span>
                    </h2>
                    <p className="text-sm text-gray-500">{userData?.email}</p>
                </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Main Menu */}
            <nav className="flex-1 space-y-2">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}
                >
                    <FiHome className="mr-3" /> Dashboard
                </button>

                <button
                    onClick={() => setActiveTab('leaves')}
                    className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'leaves' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}
                >
                    <FiCalendar className="mr-3" /> Leaves
                </button>

                <button
                    onClick={() => setActiveTab('attendance')}
                    className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'attendance' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}
                >
                    <FiClock className="mr-3" /> Attendance
                </button>

                <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50'}`}
                >
                    <FiUser className="mr-3" /> Profile
                </button>
            </nav>

            <hr className="my-4 border-gray-200" />

            {/* Quick Actions */}
            <div className="mb-4 space-y-2">
                <button
                    onClick={() => setShowLeaveForm(true)}
                    className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                    + Request Leave
                </button>
                <button
                    onClick={() => setShowTimeCorrectionForm(true)}
                    className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg mt-2"
                >
                    ⏱ Time Correction
                </button>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mt-auto"
            >
                <FiLogOut className="mr-2" /> Log Out
            </button>
        </div>
    );
};

export default EmployeeSidebar;