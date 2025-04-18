import React from 'react';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';

const TimeCorrectionRequests = ({ timeCorrectionRequests, handleTimeCorrection }) => {
    // Separate requests by status
    const pendingRequests = timeCorrectionRequests.filter(r => !r.status || r.status === 'pending');
    const processedRequests = timeCorrectionRequests.filter(r => r.status && r.status !== 'pending');

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold mb-4">Pending Time Correction Requests ({pendingRequests.length})</h2>
                    <div className="overflow-x-auto mb-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                                                    <div className="text-sm text-gray-500">{request.department}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(request.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>In: {request.currentCheckIn}</div>
                                            <div>Out: {request.currentCheckOut}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>In: {request.requestedCheckIn}</div>
                                            <div>Out: {request.requestedCheckOut}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{request.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleTimeCorrection(request.id, 'approve')}
                                                    className="text-green-600 hover:text-green-900 flex items-center"
                                                >
                                                    <FiCheck className="mr-1" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleTimeCorrection(request.id, 'reject')}
                                                    className="text-red-600 hover:text-red-900 flex items-center"
                                                >
                                                    <FiX className="mr-1" /> Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Processed Requests Section */}
            {processedRequests.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold mb-4">Processed Time Correction Requests ({processedRequests.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corrected Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {processedRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                                                    <div className="text-sm text-gray-500">{request.department}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(request.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>In: {request.currentCheckIn}</div>
                                            <div>Out: {request.currentCheckOut}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>In: {request.requestedCheckIn}</div>
                                            <div>Out: {request.requestedCheckOut}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {timeCorrectionRequests.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    No time correction requests found
                </div>
            )}
        </div>
    );
};

export default TimeCorrectionRequests;