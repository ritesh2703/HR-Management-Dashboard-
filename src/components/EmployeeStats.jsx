import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const EmployeeStats = ({ userId }) => {
    const [stats, setStats] = useState({
        leavesTaken: 0,
        leavesRemaining: 20,
        attendancePercentage: 95
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch leaves taken
                const leavesQuery = query(
                    collection(db, "leaveRequests"), 
                    where("employeeId", "==", userId),
                    where("status", "==", "approved")
                );
                const leavesSnapshot = await getDocs(leavesQuery);
                
                // Calculate total leaves taken (simplified)
                let totalDays = 0;
                leavesSnapshot.forEach(doc => {
                    const data = doc.data();
                    const diffTime = Math.abs(data.endDate - data.startDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    totalDays += diffDays;
                });
                
                setStats(prev => ({
                    ...prev,
                    leavesTaken: totalDays,
                    leavesRemaining: 20 - totalDays // Assuming 20 leaves per year
                }));
                
            } catch (error) {
                console.error("Error fetching stats: ", error);
            }
        };
        
        fetchStats();
    }, [userId]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium">Leaves Taken</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.leavesTaken}</p>
                <p className="text-sm text-gray-500">out of 20 days</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium">Leaves Remaining</h3>
                <p className="text-2xl font-bold text-green-600">{stats.leavesRemaining}</p>
                <p className="text-sm text-gray-500">available days</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium">Attendance</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.attendancePercentage}%</p>
                <p className="text-sm text-gray-500">this month</p>
            </div>
        </div>
    );
};

export default EmployeeStats;