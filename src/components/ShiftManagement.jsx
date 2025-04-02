import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ShiftManagement = ({ shifts, employees, onEmployeeToggle, onAddShift }) => {
    const [expandedShift, setExpandedShift] = useState(null);

    const toggleShiftExpand = (shiftId) => {
        setExpandedShift(expandedShift === shiftId ? null : shiftId);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Shift Management</h2>
                <button
                    onClick={onAddShift}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    <FiPlus className="mr-2" /> Add Shift
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {shifts.map((shift) => (
                            <React.Fragment key={shift.id}>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shift.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.start}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.end}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {shift.employees.slice(0, 3).map(id => 
                                            employees.find(e => e.id === id)?.fullName
                                        ).join(', ')}
                                        {shift.employees.length > 3 && ` +${shift.employees.length - 3} more`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => toggleShiftExpand(shift.id)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            {expandedShift === shift.id ? 'Hide' : 'View'} Details
                                        </button>
                                    </td>
                                </tr>
                                {expandedShift === shift.id && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                                            <div className="mb-4">
                                                <h4 className="font-medium mb-2">Assign Employees to {shift.name} Shift</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {employees.map(employee => (
                                                        <div key={employee.id} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`emp-${employee.id}-shift-${shift.id}`}
                                                                checked={shift.employees.includes(employee.id)}
                                                                onChange={() => onEmployeeToggle(employee.id, shift.id)}
                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                            />
                                                            <label htmlFor={`emp-${employee.id}-shift-${shift.id}`} className="ml-2 block text-sm text-gray-900">
                                                                {employee.fullName} ({employee.department})
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShiftManagement;