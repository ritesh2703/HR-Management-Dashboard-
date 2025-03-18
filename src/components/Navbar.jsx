import React from "react";
import { FiSearch, FiInfo, FiMinimize2, FiBell } from "react-icons/fi";

const Navbar = () => {
  return (
    <div className="bg-white shadow-md p-3 flex justify-between items-center border-none">
      {/* Search Bar */}
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-14 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 w-full"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          ⌘ K
        </span>
      </div>

      {/* Icons Section */}
      <div className="flex space-x-3">
        <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
          <FiInfo className="text-gray-600" />
        </button>
        <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
          <FiMinimize2 className="text-gray-600" />
        </button>
        <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
          <FiBell className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
