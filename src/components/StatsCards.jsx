import React from 'react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

const StatCard = ({ title, value, change, isPositive, description, borderColor }) => (
    <div className={`bg-white shadow-md rounded-lg p-5 border-t-4 ${borderColor}`}>
        {/* Header Section */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                <Info size={16} className="text-gray-400 cursor-pointer" />
            </div>
            <div className="text-gray-400 cursor-pointer">&#8942;</div>
        </div>

        {/* Main Content */}
        <div className="flex items-end justify-between mt-3">
            <p className="text-4xl font-bold">{value}</p>
            <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {change}
            </div>
        </div>

        {/* Description Section */}
        <div className="mt-2 py-2 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500 px-3">{description}</p>
        </div>

        {/* Details Button */}
        <div className="flex justify-end mt-3">
            <button className="text-blue-500 text-sm font-medium flex items-center gap-1 ">
                Details →
            </button>
        </div>
    </div>
);

const StatsCards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
                title="Total Employees" 
                value="173" 
                change="1.8%" 
                isPositive={true} 
                description="+16 from last month"
                borderColor="border-blue-500"
            />
            <StatCard 
                title="Job Applicants" 
                value="983" 
                change="2.4%" 
                isPositive={true} 
                description="+32 from last month"
                borderColor="border-green-500"
            />
            <StatCard 
                title="Total Revenue" 
                value="$4,842.00" 
                change="4.2%" 
                isPositive={true} 
                description="+$3,834.00 from last month"
                borderColor="border-purple-500"
            />
            <StatCard 
                title="Attendance Rate" 
                value="75%" 
                change="1.7%" 
                isPositive={false} 
                description="-6.4% from last month"
                borderColor="border-red-500"
            />
        </div>
    );
};

export default StatsCards;
