import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import TaskManagement from "../components/TaskManagement";
import AttendanceGraph from "../components/AttendanceGraph";
import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dateTime, setDateTime] = useState('');
    const [showSentenceBox, setShowSentenceBox] = useState(true); // State to control the visibility of the sentence box
    const navigate = useNavigate();

    // Sample Tasks Data
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Employee Onboarding Approval',
            status: 'new',
            employeeName: 'Jane Smith (Marketing)',
            description: 'Verify documents, approve onboarding, and schedule a meeting.',
            date: '2025-03-07', // Added date
        },
        {
            id: 2,
            title: 'Payroll Processing',
            status: 'in-progress',
            employeeName: 'Finance Team',
            description: 'Calculate salaries, bonuses, and resolve discrepancies by March 10.',
            date: '2025-03-05', // Added date
        },
        {
            id: 3,
            title: 'Employee Satisfaction Survey',
            status: 'completed',
            employeeName: 'HR Team',
            description: 'Analyze feedback to identify areas for improvement.',
            date: '2025-02-28', // Added date
        },
        {
            id: 4,
            title: 'Performance Review Scheduling',
            status: 'new',
            employeeName: 'John Doe (Sales)',
            description: 'Schedule performance reviews for the sales team and prepare evaluation forms.',
            date: '2025-03-08', // Added date
        },
        {
            id: 5,
            title: 'Training Program Development',
            status: 'in-progress',
            employeeName: 'Training Department',
            description: 'Develop a new training program for customer service representatives.',
            date: '2025-03-06', // Added date
        },
        {
            id: 6,
            title: 'Office Relocation Planning',
            status: 'in-progress',
            employeeName: 'Operations Team',
            description: 'Plan and coordinate the relocation of the office to a new building.',
            date: '2025-03-09', // Added date
        },
        {
            id: 7,
            title: 'Annual Budget Approval',
            status: 'completed',
            employeeName: 'Finance Team',
            description: 'Review and approve the annual budget for the upcoming fiscal year.',
            date: '2025-02-25', // Added date
        },
        {
            id: 8,
            title: 'IT Infrastructure Upgrade',
            status: 'new',
            employeeName: 'IT Department',
            description: 'Upgrade the company\'s IT infrastructure to improve security and performance.',
            date: '2025-03-10', // Added date
        },
        {
            id: 9,
            title: 'Marketing Campaign Launch',
            status: 'in-progress',
            employeeName: 'Marketing Team',
            description: 'Launch the new marketing campaign for the upcoming product release.',
            date: '2025-03-04', // Added date
        },
        {
            id: 10,
            title: 'Employee Wellness Program',
            status: 'completed',
            employeeName: 'HR Team',
            description: 'Implement a new wellness program to promote employee health and well-being.',
            date: '2025-02-20', // Added date
        },
    ]);
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;

            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log('No such user data!');
                }
            } else {
                navigate('/login');
            }
        };

        fetchUserData();

        // Live Date and Time with Day
        const interval = setInterval(() => {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            setDateTime(now.toLocaleDateString('en-US', options));
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Task Status Update Handler
    const updateTaskStatus = (taskId, newStatus) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
    };

    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar userData={userData} handleLogout={handleLogout} openModal={openModal} />

            <div className="flex-1">
                <Navbar />
                <div className="p-8">
                    {/* Sentence in a Box with Close Button */}
                    {showSentenceBox && (
                        <div className="bg-white rounded-lg p-4 mb-6 shadow-md relative border-t-4 border-fuchsia-500">
                            <button
                                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                                onClick={() => setShowSentenceBox(false)} // Close the box
                            >
                                <FiX size={20} />
                            </button>
                            <p className="text-gray-700 text-lg font-semibold">
                                Optimize your Efficio experience—track attendance, manage teams, and streamline HR operations effortlessly!
                            </p>
                        </div>
                    )}

                    {/* Bold Date, Time, and Day */}
                    <h1 className="text-3xl font-bold text-blue-700 mb-2">
                        Welcome, {userData?.fullName || 'User'}!
                    </h1>
                    <p className="text-sm text-black font-bold mb-6">{dateTime}</p>

                    {/* Two-Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* First Column - StatsCards */}
                        <div>
                            <StatsCards />
                        </div>

                        {/* Second Column - AttendanceGraph */}
                        <div>
                            <AttendanceGraph />
                        </div>
                    </div>

                    {/* Task Management Section */}
                    <TaskManagement tasks={tasks} updateTaskStatus={updateTaskStatus} />
                </div>
            </div>

            {/* Profile Image Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="relative bg-white p-4 rounded-lg shadow-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                            onClick={closeModal}
                        >
                            <FiX size={24} />
                        </button>

                        <img
                            src={userData?.profileImage}
                            alt="Enlarged Profile"
                            className="max-w-[90vw] max-h-[80vh] rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;