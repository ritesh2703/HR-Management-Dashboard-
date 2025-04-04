import React from 'react';
import { FiUser, FiBriefcase, FiDollarSign, FiClock, FiLogOut, FiSettings, FiHelpCircle, FiInbox, FiCalendar, FiFolder } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Sidebar = ({ userData, handleLogout, openModal }) => {
  return (
    <div className="w-72 bg-white shadow-lg border-r p-5">
      {/* Header with Efficio and Line */}
      <div className="flex justify-center items-center mb-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-blue-700">Efficio</h1>
          <hr className="my-2 border-gray-200" />
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center space-x-4 mb-6">
        {userData?.profileImage && (
          <img
            src={userData.profileImage}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-blue-500 cursor-pointer hover:scale-105 transition-all"
            onClick={openModal}
          />
        )}
        <div>
          <h2 className="text-lg font-bold text-blue-600">
            {userData?.fullName || 'Arnold Smith'} 
            <span className="text-sm text-gray-500"> ({userData?.role || 'HR Manager'})</span>
          </h2>
          <p className="text-sm text-gray-500">{userData?.email || 'arnoldsmith@gmail.com'}</p>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {/* Main Menu Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Main Menu</h3>
        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
            <FiUser className="mr-2" /> Dashboard
          </Link>
          <Link to="/tasks" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
  <FiFolder className="mr-2" /> Tasks
</Link>
          <Link to="/inbox" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
            <FiInbox className="mr-2" /> Inbox
          </Link>
          <Link to="/calendar" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
            <FiCalendar className="mr-2" /> Calendar
          </Link>
          <Link to="/projects" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
            <FiBriefcase className="mr-2" /> Projects
          </Link>
        </nav>
      </div>

      {/* HR Management Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">HR Management</h3>
        <nav className="space-y-2">
          <Link to="/employees" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
            <FiUser className="mr-2" /> Employees
          </Link>
          <Link to="/attendance" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
            <FiClock className="mr-2" /> Attendance
          </Link>
          <Link to="/payroll" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
            <FiDollarSign className="mr-2" /> Payroll
          </Link>
          <Link to="/hiring" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
            <FiBriefcase className="mr-2" /> Hiring
          </Link>
        </nav>
      </div>

      {/* Analytics & Reports Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Analytics & Reports</h3>
        <nav className="space-y-2">
          <Link to="/settings" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
            <FiSettings className="mr-2" /> Settings
          </Link>
          <Link to="/help-support" className="flex items-center p-2 text-gray-700 hover:bg-blue-100 rounded-md">
            <FiHelpCircle className="mr-2" /> Help & Support
          </Link>
        </nav>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
      >
        <FiLogOut className="mr-2" /> Log Out
      </button>
    </div>
  );
};

export default Sidebar;