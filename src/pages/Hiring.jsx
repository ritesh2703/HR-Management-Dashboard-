import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Hiring = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            } else {
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const openModal = () => console.log("Open profile modal");

    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar userData={userData} handleLogout={handleLogout} openModal={openModal} />
            
            <div className="flex-1">
                <Navbar />
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-blue-700 mb-6">Hiring Management</h1>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Candidate Pipeline</h2>
                        {/* Add your hiring components here */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                <h3 className="font-medium mb-2">New Applicants</h3>
                                <p>Review new job applications</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                                <h3 className="font-medium mb-2">Interviews</h3>
                                <p>Schedule and manage interviews</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                                <h3 className="font-medium mb-2">Offers</h3>
                                <p>Manage job offers and onboarding</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hiring;