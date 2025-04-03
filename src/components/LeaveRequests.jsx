import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leave requests from Firestore
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "leaveRequests"));
        const requests = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          requests.push({
            id: doc.id,
            employeeName: data.employeeName || 'RITESH',
            department: data.department || 'Employee',
            leaveType: data.leaveType,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
            reason: data.reason,
            status: data.status || 'pending',
            createdAt: data.createdAt.toDate()
          });
        });
        
        setLeaveRequests(requests);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle approve/reject actions
  const handleLeaveAction = async (requestId, action) => {
    try {
      const requestRef = doc(db, "leaveRequests", requestId);
      await updateDoc(requestRef, {
        status: action
      });
      
      // Update local state to reflect the change
      setLeaveRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId ? { ...request, status: action } : request
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading leave requests...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  const pendingRequests = leaveRequests.filter(l => l.status === 'pending');
  const processedRequests = leaveRequests.filter(l => l.status !== 'pending');

  return (
    <div className="container mx-auto px-4 py-8">
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pending Leave Requests ({pendingRequests.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
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
                      {request.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.startDate.toLocaleDateString()} - {request.endDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{request.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleLeaveAction(request.id, 'approved')}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <FiCheck className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleLeaveAction(request.id, 'rejected')}
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
        </div>
      )}

      {processedRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Processed Leave Requests ({processedRequests.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
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
                      {request.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.startDate.toLocaleDateString()} - {request.endDate.toLocaleDateString()}
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
        </div>
      )}

      {leaveRequests.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">No leave requests found.</div>
      )}
    </div>
  );
};

export default LeaveRequests;