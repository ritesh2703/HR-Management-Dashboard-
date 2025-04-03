import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Sidebar from '../components/EmployeeSidebar';
import Navbar from '../components/Navbar';
import LeaveRequestForm from '../components/LeaveRequestForm';
import TimeCorrectionForm from '../components/TimeCorrectionForm';
import EmployeeStats from '../components/EmployeeStats';

const EmployeeDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showLeaveForm, setShowLeaveForm] = useState(false);
    const [showTimeCorrectionForm, setShowTimeCorrectionForm] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [timeCorrections, setTimeCorrections] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                        fetchLeaveRequests(user.uid);
                        fetchTimeCorrections(user.uid);
                    } else {
                        setError("User data not found");
                    }
                } catch (err) {
                    setError("Error fetching user data");
                    console.error("Error fetching user data: ", err);
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchLeaveRequests = async (userId) => {
        try {
            const q = query(
                collection(db, "leaveRequests"),
                where("employeeId", "==", userId)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                startDate: doc.data().startDate?.toDate(),
                endDate: doc.data().endDate?.toDate(),
                createdAt: doc.data().createdAt?.toDate()
            }));
            setLeaveRequests(data);
        } catch (error) {
            console.error("Error fetching leave requests:", error);
            setError("Failed to load leave requests");
        }
    };

    const fetchTimeCorrections = async (userId) => {
        try {
            const q = query(
                collection(db, "timeCorrections"),
                where("employeeId", "==", userId)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate(),
                createdAt: doc.data().createdAt?.toDate()
            }));
            setTimeCorrections(data);
        } catch (error) {
            console.error("Error fetching time corrections:", error);
            setError("Failed to load time corrections");
        }
    };

    const handleLeaveSubmit = async (leaveData) => {
        try {
            await addDoc(collection(db, "leaveRequests"), {
                ...leaveData,
                createdAt: Timestamp.now(),
                status: 'pending'
            });
            setShowLeaveForm(false);
            fetchLeaveRequests(auth.currentUser.uid);
        } catch (error) {
            console.error("Error submitting leave request:", error);
            setError("Failed to submit leave request");
        }
    };

    const handleTimeCorrectionSubmit = async (timeData) => {
        try {
            await addDoc(collection(db, "timeCorrections"), {
                ...timeData,
                createdAt: Timestamp.now(),
                status: 'pending'
            });
            setShowTimeCorrectionForm(false);
            fetchTimeCorrections(auth.currentUser.uid);
        } catch (error) {
            console.error("Error submitting time correction:", error);
            setError("Failed to submit time correction");
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Error signing out: ", error);
            setError("Error signing out");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!userData) {
        return <div className="flex justify-center items-center h-screen">User data not available</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar 
                userData={userData} 
                handleLogout={handleLogout} 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowLeaveForm={setShowLeaveForm}
                setShowTimeCorrectionForm={setShowTimeCorrectionForm}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                
                <main className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userData.fullName}</h1>
                                <p className="text-gray-600">Here's what's happening today</p>
                            </div>
                            
                            <EmployeeStats userId={auth.currentUser.uid} />
                            
                            <div className="grid grid-cols-1 gap-6 mt-6">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">Quick Actions</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => setShowLeaveForm(true)}
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 px-4 rounded-lg flex items-center justify-center"
                                        >
                                            <span className="mr-2">➕</span> Request Leave
                                        </button>
                                        <button 
                                            onClick={() => setShowTimeCorrectionForm(true)}
                                            className="bg-green-100 hover:bg-green-200 text-green-800 py-3 px-4 rounded-lg flex items-center justify-center"
                                        >
                                            <span className="mr-2">⏱️</span> Request Time Correction
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-xl font-semibold mb-4">Recent Leave Requests</h2>
                                    {leaveRequests.slice(0, 3).length === 0 ? (
                                        <p className="text-gray-500">No recent leave requests</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {leaveRequests.slice(0, 3).map(request => (
                                                <div key={request.id} className="border-b pb-3">
                                                    <div className="flex justify-between">
                                                        <span className="capitalize">{request.leaveType}</span>
                                                        <span className={`text-xs px-2 py-1 rounded ${
                                                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {request.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {request.startDate?.toLocaleDateString()} - {request.endDate?.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {leaveRequests.length > 3 && (
                                        <button 
                                            onClick={() => setActiveTab('leaves')}
                                            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            View all leaves →
                                        </button>
                                    )}
                                </div>
                                
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-xl font-semibold mb-4">Recent Time Corrections</h2>
                                    {timeCorrections.slice(0, 3).length === 0 ? (
                                        <p className="text-gray-500">No recent time corrections</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {timeCorrections.slice(0, 3).map(correction => (
                                                <div key={correction.id} className="border-b pb-3">
                                                    <div className="flex justify-between">
                                                        <span>{correction.date?.toLocaleDateString()}</span>
                                                        <span className={`text-xs px-2 py-1 rounded ${
                                                            correction.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            correction.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {correction.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {correction.currentCheckIn} → {correction.requestedCheckIn}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {timeCorrections.length > 3 && (
                                        <button 
                                            onClick={() => setActiveTab('attendance')}
                                            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            View all time corrections →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    
                    {activeTab === 'leaves' && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">My Leave Requests</h2>
                                <button 
                                    onClick={() => setShowLeaveForm(true)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                                >
                                    + New Leave Request
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {leaveRequests.length === 0 ? (
                                    <p className="text-gray-500">No leave requests found</p>
                                ) : (
                                    leaveRequests.map(request => (
                                        <div key={request.id} className="border-b pb-4">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="font-medium capitalize">{request.leaveType} Leave</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {request.startDate?.toLocaleDateString()} - {request.endDate?.toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                            {request.reason && <p className="mt-2 text-sm">{request.reason}</p>}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'attendance' && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">My Attendance</h2>
                                <button 
                                    onClick={() => setShowTimeCorrectionForm(true)}
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                                >
                                    + Request Time Correction
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {timeCorrections.length === 0 ? (
                                    <p className="text-gray-500">No time correction requests found</p>
                                ) : (
                                    timeCorrections.map(correction => (
                                        <div key={correction.id} className="border-b pb-4">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="font-medium">Time Correction</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {correction.date?.toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    correction.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    correction.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {correction.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div>
                                                    <p className="text-sm font-medium">Current:</p>
                                                    <p className="text-sm">In: {correction.currentCheckIn}</p>
                                                    <p className="text-sm">Out: {correction.currentCheckOut}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Requested:</p>
                                                    <p className="text-sm">In: {correction.requestedCheckIn}</p>
                                                    <p className="text-sm">Out: {correction.requestedCheckOut}</p>
                                                </div>
                                            </div>
                                            {correction.reason && <p className="mt-2 text-sm">{correction.reason}</p>}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
            
            {/* Modals */}
            {showLeaveForm && (
                <LeaveRequestForm 
                    onClose={() => setShowLeaveForm(false)} 
                    userId={auth.currentUser.uid}
                    onSubmit={handleLeaveSubmit}
                />
            )}
            
            {showTimeCorrectionForm && (
                <TimeCorrectionForm 
                    onClose={() => setShowTimeCorrectionForm(false)} 
                    userId={auth.currentUser.uid}
                    onSubmit={handleTimeCorrectionSubmit}
                />
            )}
        </div>
    );
};

export default EmployeeDashboard;