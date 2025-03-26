import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FiX, FiMail, FiStar, FiTrash2, FiArchive, FiCornerUpLeft, FiCornerUpRight, FiSend, FiEdit, FiInbox, FiAlertCircle } from 'react-icons/fi';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Inbox = () => {
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dateTime, setDateTime] = useState('');
    const [showWelcomeBox, setShowWelcomeBox] = useState(true);
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('inbox');
    const [replyContent, setReplyContent] = useState('');
    const [forwardContent, setForwardContent] = useState('');
    const [forwardRecipient, setForwardRecipient] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [isForwarding, setIsForwarding] = useState(false);
    const [isComposing, setIsComposing] = useState(false);
    const [composeData, setComposeData] = useState({
        to: '',
        subject: '',
        content: ''
    });
    const [replies, setReplies] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [forwardedMessages, setForwardedMessages] = useState([]);
    const navigate = useNavigate();
    const messagesContainerRef = useRef(null);

    // Sample Messages Data - IT Company HR Emails
    const sampleMessages = [
        {
            id: 1,
            from: 'HR Department',
            email: 'hr@itcompany.com',
            subject: 'Important: Annual Performance Reviews',
            content: 'Dear Team,\n\nThis is a reminder that annual performance reviews are scheduled for next week. Please complete your self-assessment forms by Friday and book your review slot with your manager.\n\nBest regards,\nHR Team',
            date: '2025-03-18',
            time: '09:00 AM',
            read: false,
            starred: true,
            labels: ['hr', 'important']
        },
        {
            id: 2,
            from: 'Payroll Team',
            email: 'payroll@itcompany.com',
            subject: 'March Salary Disbursement',
            content: 'Hello,\n\nMarch salaries have been processed and will reflect in your accounts by March 31st. Please check your payslips in the employee portal and contact us if you find any discrepancies.\n\nRegards,\nPayroll Team',
            date: '2025-03-17',
            time: '02:30 PM',
            read: true,
            starred: false,
            labels: ['payroll']
        },
        {
            id: 3,
            from: 'Training Coordinator',
            email: 'training@itcompany.com',
            subject: 'Upcoming AWS Certification Training',
            content: 'Hi Developers,\n\nWe are organizing an AWS certification training program starting April 1st. Limited seats available. Please register by March 25th if interested.\n\nTraining Schedule:\n- Weekdays: 6-8 PM\n- Weekends: 10 AM-1 PM\n\nThanks,\nTraining Team',
            date: '2025-03-16',
            time: '11:15 AM',
            read: false,
            starred: true,
            labels: ['training', 'technical']
        },
        {
            id: 4,
            from: 'IT Support',
            email: 'itsupport@itcompany.com',
            subject: 'VPN Maintenance Scheduled',
            content: 'Attention All,\n\nThere will be VPN maintenance this Saturday from 2 AM to 6 AM. During this time, remote access will be unavailable. Please plan your work accordingly.\n\nIT Support Team',
            date: '2025-03-15',
            time: '04:45 PM',
            read: true,
            starred: false,
            labels: ['it', 'maintenance']
        },
        {
            id: 5,
            from: 'HR Head',
            email: 'hrhead@itcompany.com',
            subject: 'New WFH Policy Update',
            content: 'Dear Employees,\n\nStarting April, we are implementing a hybrid work model:\n- 3 days office (Mon-Wed)\n- 2 days WFH (Thu-Fri)\n\nPlease review the attached policy document and acknowledge receipt.\n\nRegards,\nHR Head',
            date: '2025-03-14',
            time: '10:30 AM',
            read: false,
            starred: true,
            labels: ['hr', 'policy', 'important']
        },
        {
            id: 6,
            from: 'Recruitment Team',
            email: 'recruitment@itcompany.com',
            subject: 'Employee Referral Bonus Program',
            content: 'Hello Team,\n\nWe have openings for Senior Developers and DevOps Engineers. Refer qualified candidates and earn ₹50,000 per successful hire! See portal for details.\n\nHappy Hiring!\nRecruitment Team',
            date: '2025-03-13',
            time: '03:20 PM',
            read: true,
            starred: false,
            labels: ['recruitment', 'bonus']
        },
        {
            id: 7,
            from: 'Facilities Manager',
            email: 'facilities@itcompany.com',
            subject: 'Office AC Maintenance',
            content: 'Notice:\n\nAC maintenance will be conducted floor-wise from March 20-22. Your floor schedule:\n- 3rd Floor: March 20 (10 AM-2 PM)\nPlease bear with temporary temperature variations.\n\nFacilities Team',
            date: '2025-03-12',
            time: '01:00 PM',
            read: true,
            starred: false,
            labels: ['facilities']
        },
        {
            id: 8,
            from: 'Compliance Officer',
            email: 'compliance@itcompany.com',
            subject: 'Mandatory Cybersecurity Training',
            content: 'Urgent:\n\nAll employees must complete the new cybersecurity training module by March 25th. This is mandatory per company policy. Non-compliance may affect app access.\n\nCompliance Team',
            date: '2025-03-11',
            time: '11:45 AM',
            read: false,
            starred: true,
            labels: ['compliance', 'training', 'important']
        },
        {
            id: 9,
            from: 'Team Lead - Project X',
            email: 'projectx@itcompany.com',
            subject: 'Client Demo Preparation',
            content: 'Hi Team,\n\nClient demo scheduled for March 22 at 11 AM. Please ensure:\n1. All test cases pass\n2. Documentation updated\n3. Demo script rehearsed\n\nLet\'s meet tomorrow at 4 PM to review progress.\n\nThanks,\nTeam Lead',
            date: '2025-03-10',
            time: '05:30 PM',
            read: true,
            starred: false,
            labels: ['project', 'client']
        },
        {
            id: 10,
            from: 'CEO Office',
            email: 'ceo@itcompany.com',
            subject: 'Quarterly Townhall Meeting',
            content: 'Dear Team,\n\nJoin us for our Q1 Townhall on March 28th at 3 PM in the auditorium. Agenda includes:\n- Company performance\n- New initiatives\n- Q&A session\n\nAttendance is mandatory for all employees.\n\nBest,\nCEO Office',
            date: '2025-03-09',
            time: '09:15 AM',
            read: false,
            starred: true,
            labels: ['ceo', 'important', 'meeting']
        }
    ];

    // Sample replies data
    const sampleReplies = [
        {
            id: 1,
            messageId: 1,
            from: 'You',
            email: 'employee@itcompany.com',
            content: 'Thanks for the reminder. I have completed my self-assessment and booked a slot with my manager for March 20th at 11 AM.',
            date: '2025-03-18',
            time: '10:30 AM'
        },
        {
            id: 2,
            messageId: 5,
            from: 'You',
            email: 'employee@itcompany.com',
            content: 'I have reviewed the new WFH policy and submitted my acknowledgment. Looking forward to the hybrid work model!',
            date: '2025-03-14',
            time: '02:45 PM'
        }
    ];

    // Sample sent messages
    const sampleSentMessages = [
        {
            id: 101,
            to: 'hr@itcompany.com',
            subject: 'Leave Application - March 25-27',
            content: 'Dear HR,\n\nI would like to apply for leave from March 25th to 27th for personal reasons. Please approve my application.\n\nRegards,\n[Your Name]',
            date: '2025-03-17',
            time: '11:20 AM',
            starred: false,
            labels: ['hr', 'leave']
        },
        {
            id: 102,
            to: 'training@itcompany.com',
            subject: 'Registration for AWS Training',
            content: 'Hi Training Team,\n\nI would like to register for the AWS certification training program starting April 1st. Please confirm my enrollment.\n\nThanks,\n[Your Name]',
            date: '2025-03-16',
            time: '03:45 PM',
            starred: true,
            labels: ['training', 'technical']
        }
    ];

    // Sample forwarded messages
    const sampleForwardedMessages = [
        {
            id: 201,
            to: 'teamlead@itcompany.com',
            originalFrom: 'client@business.com',
            subject: 'FW: Urgent Bug Fix Request',
            content: 'Hi Team Lead,\n\nForwarding this client request regarding a critical bug in the production environment. They need this fixed ASAP.\n\n---------- Forwarded Message ----------\nFrom: Client <client@business.com>\nSubject: Production Issue\n\nWe are experiencing a critical bug where...',
            date: '2025-03-15',
            time: '10:15 AM',
            starred: false,
            labels: ['client', 'urgent']
        }
    ];

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
        setMessages(sampleMessages);
        setReplies(sampleReplies);
        setSentMessages(sampleSentMessages);
        setForwardedMessages(sampleForwardedMessages);

        // Live Date and Time with Day
        const interval = setInterval(() => {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            setDateTime(now.toLocaleDateString('en-US', options));
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    // Scroll to top when tab changes
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const toggleStar = (messageId) => {
        setMessages(messages.map(msg => 
            msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
        ));
        setSentMessages(sentMessages.map(msg => 
            msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
        ));
        setForwardedMessages(forwardedMessages.map(msg => 
            msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
        ));
        if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage({
                ...selectedMessage,
                starred: !selectedMessage.starred
            });
        }
    };

    const markAsRead = (messageId) => {
        setMessages(messages.map(msg => 
            msg.id === messageId ? { ...msg, read: true } : msg
        ));
    };

    const deleteMessage = (messageId) => {
        setMessages(messages.filter(msg => msg.id !== messageId));
        setSentMessages(sentMessages.filter(msg => msg.id !== messageId));
        setForwardedMessages(forwardedMessages.filter(msg => msg.id !== messageId));
        if (selectedMessage && selectedMessage.id === messageId) {
            setSelectedMessage(null);
        }
    };

    const handleReply = () => {
        setIsReplying(true);
        setIsForwarding(false);
        setIsComposing(false);
        setReplyContent(`\n\n---------- Original Message ----------\nFrom: ${selectedMessage.from} <${selectedMessage.email}>\nDate: ${selectedMessage.date} at ${selectedMessage.time}\nSubject: ${selectedMessage.subject}\n\n${selectedMessage.content}`);
    };

    const handleForward = () => {
        setIsForwarding(true);
        setIsReplying(false);
        setIsComposing(false);
        setForwardContent(`\n\n---------- Forwarded Message ----------\nFrom: ${selectedMessage.from} <${selectedMessage.email}>\nDate: ${selectedMessage.date} at ${selectedMessage.time}\nSubject: ${selectedMessage.subject}\n\n${selectedMessage.content}`);
    };

    const sendReply = () => {
        const newReply = {
            id: replies.length + 1,
            messageId: selectedMessage.id,
            from: 'You',
            email: userData?.email || 'me@example.com',
            content: replyContent,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        // Create a new sent message from the reply
        const newSentMessage = {
            id: Date.now(),
            to: selectedMessage.email,
            subject: `Re: ${selectedMessage.subject}`,
            content: replyContent,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            starred: false,
            labels: ['sent']
        };
        
        setReplies([...replies, newReply]);
        setSentMessages([newSentMessage, ...sentMessages]);
        alert('Reply sent successfully!');
        setIsReplying(false);
        setReplyContent('');
    };

    const sendForward = () => {
        if (!forwardRecipient) {
            alert('Please enter a recipient email');
            return;
        }
        
        // Create a new forwarded message
        const newForwardedMessage = {
            id: Date.now(),
            to: forwardRecipient,
            originalFrom: selectedMessage.from,
            subject: `FW: ${selectedMessage.subject}`,
            content: forwardContent,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            starred: false,
            labels: ['forwarded']
        };
        
        setForwardedMessages([newForwardedMessage, ...forwardedMessages]);
        alert(`Message forwarded to ${forwardRecipient}`);
        setIsForwarding(false);
        setForwardContent('');
        setForwardRecipient('');
    };

    const handleCompose = () => {
        setIsComposing(true);
        setIsReplying(false);
        setIsForwarding(false);
        setSelectedMessage(null);
    };

    const handleComposeChange = (e) => {
        const { name, value } = e.target;
        setComposeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const sendComposedMail = () => {
        if (!composeData.to || !composeData.subject) {
            alert('Please fill in all required fields');
            return;
        }
        
        const newMessage = {
            id: Date.now(),
            to: composeData.to,
            subject: composeData.subject,
            content: composeData.content,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            starred: false,
            labels: ['sent']
        };
        
        setSentMessages([newMessage, ...sentMessages]);
        alert('Message sent successfully!');
        setIsComposing(false);
        setComposeData({ to: '', subject: '', content: '' });
    };

    const filteredMessages = 
        activeTab === 'starred' 
            ? [...messages, ...sentMessages, ...forwardedMessages].filter(msg => msg.starred)
            : activeTab === 'unread'
            ? messages.filter(msg => !msg.read)
            : activeTab === 'sent'
            ? sentMessages
            : activeTab === 'forwarded'
            ? forwardedMessages
            : messages;

    const messageReplies = selectedMessage 
        ? replies.filter(reply => reply.messageId === selectedMessage.id)
        : [];

    const getTabTitle = () => {
        switch (activeTab) {
            case 'starred': return 'Starred Messages';
            case 'unread': return 'Unread Messages';
            case 'sent': return 'Sent Messages';
            case 'forwarded': return 'Forwarded Messages';
            default: return 'Inbox';
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar 
                userData={userData} 
                handleLogout={handleLogout} 
                openModal={openModal} 
                onCompose={handleCompose}
            />

            <div className="flex-1 flex flex-col">
                <Navbar />
                
                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
                    <div className="p-6 pb-0">
                        {/* Welcome Box */}
                        {showWelcomeBox && (
                            <div className="bg-blue-50 rounded-lg p-4 mb-6 shadow-sm relative border-l-4 border-blue-500">
                                <button
                                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                                    onClick={() => setShowWelcomeBox(false)}
                                >
                                    <FiX size={20} />
                                </button>
                                <div className="flex items-start">
                                    <FiInbox className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={24} />
                                    <div>
                                        <p className="text-gray-800 text-lg font-semibold">Welcome to your inbox!</p>
                                        <p className="text-gray-600 mt-1">
                                            You have {messages.filter(m => !m.read).length} unread messages. Stay organized with our email management tools.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Header with Greeting and Date */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                                    {getTabTitle()}, {userData?.fullName || 'User'}!
                                </h1>
                                <p className="text-sm text-gray-500">{dateTime}</p>
                            </div>
                            <button
                                onClick={handleCompose}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center shadow-md"
                            >
                                <FiEdit className="mr-2" /> Compose
                            </button>
                        </div>

                        {/* Tabs for Inbox/Starred/Unread/Sent/Forwarded */}
                        <div className="flex border-b mb-4 overflow-x-auto">
                            <button
                                className={`py-2 px-4 font-medium flex items-center ${activeTab === 'inbox' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('inbox')}
                            >
                                <FiInbox className="mr-2" /> Inbox ({messages.length})
                            </button>
                            <button
                                className={`py-2 px-4 font-medium flex items-center ${activeTab === 'starred' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('starred')}
                            >
                                <FiStar className="mr-2" /> Starred ({[...messages, ...sentMessages, ...forwardedMessages].filter(msg => msg.starred).length})
                            </button>
                            <button
                                className={`py-2 px-4 font-medium flex items-center ${activeTab === 'unread' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('unread')}
                            >
                                <FiAlertCircle className="mr-2" /> Unread ({messages.filter(msg => !msg.read).length})
                            </button>
                            <button
                                className={`py-2 px-4 font-medium flex items-center ${activeTab === 'sent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('sent')}
                            >
                                <FiSend className="mr-2" /> Sent ({sentMessages.length})
                            </button>
                            <button
                                className={`py-2 px-4 font-medium flex items-center ${activeTab === 'forwarded' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('forwarded')}
                            >
                                <FiCornerUpRight className="mr-2" /> Forwarded ({forwardedMessages.length})
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-hidden px-6 pb-6">
                        <div className="flex flex-col md:flex-row gap-6 h-full" style={{ minHeight: '600px' }}>
                            {/* Message List Column */}
                            <div className={`${selectedMessage || isComposing ? 'hidden md:block md:w-2/5' : 'w-full'} bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col`} style={{ height: '100%' }}>
                                <div className="p-4 border-b bg-gray-50">
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        {getTabTitle()} ({filteredMessages.length})
                                    </h2>
                                </div>
                                <div 
                                    ref={messagesContainerRef}
                                    className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                    style={{ height: 'calc(100% - 60px)' }}
                                >
                                    {filteredMessages.length > 0 ? (
                                        filteredMessages.map(message => (
                                            <div 
                                                key={message.id}
                                                className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${!message.read && activeTab !== 'sent' && activeTab !== 'forwarded' ? 'bg-blue-50' : ''} ${selectedMessage?.id === message.id ? 'bg-blue-100' : ''}`}
                                                onClick={() => {
                                                    setSelectedMessage(message);
                                                    if (activeTab !== 'sent' && activeTab !== 'forwarded') {
                                                        markAsRead(message.id);
                                                    }
                                                }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-start">
                                                        {!message.read && activeTab !== 'sent' && activeTab !== 'forwarded' && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2"></span>
                                                        )}
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleStar(message.id);
                                                            }}
                                                            className="mr-2 text-gray-400 hover:text-yellow-400 mt-1"
                                                        >
                                                            <FiStar className={message.starred ? 'text-yellow-400 fill-yellow-400' : ''} />
                                                        </button>
                                                        <div className="flex-1">
                                                            <div className="flex items-center">
                                                                <span className={`font-medium ${(!message.read && activeTab !== 'sent' && activeTab !== 'forwarded') ? 'text-blue-700' : 'text-gray-700'}`}>
                                                                    {activeTab === 'sent' ? `To: ${message.to}` : 
                                                                     activeTab === 'forwarded' ? `To: ${message.to}` : 
                                                                     message.from}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                {activeTab === 'sent' ? message.date : 
                                                                 activeTab === 'forwarded' ? `From: ${message.originalFrom}` : 
                                                                 message.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{message.time}</span>
                                                </div>
                                                <h3 className={`mt-1 ${(!message.read && activeTab !== 'sent' && activeTab !== 'forwarded') ? 'font-semibold' : ''}`}>
                                                    {message.subject}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {message.content.substring(0, 80)}...
                                                </p>
                                                <div className="flex justify-end mt-2 space-x-2">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteMessage(message.id);
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 p-1"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">
                                            <FiMail size={48} className="mx-auto mb-4 text-gray-300" />
                                            <p>No messages found in this folder</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message Detail Column or Compose New Message */}
                            {isComposing ? (
                                <div className="w-full md:w-3/5 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
                                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-gray-700">New Message</h2>
                                        <button 
                                            className="text-gray-400 hover:text-red-500"
                                            onClick={() => setIsComposing(false)}
                                        >
                                            <FiX size={20} />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                                            <input 
                                                type="email" 
                                                name="to"
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="recipient@example.com"
                                                value={composeData.to}
                                                onChange={handleComposeChange}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                                            <input 
                                                type="text" 
                                                name="subject"
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Subject"
                                                value={composeData.subject}
                                                onChange={handleComposeChange}
                                            />
                                        </div>
                                        <textarea
                                            name="content"
                                            className="w-full p-3 border border-gray-300 rounded-lg mb-3 h-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={composeData.content}
                                            onChange={handleComposeChange}
                                            placeholder="Write your message here..."
                                        />
                                        <div className="flex justify-end space-x-3">
                                            <button 
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                                onClick={() => setIsComposing(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors shadow-md"
                                                onClick={sendComposedMail}
                                            >
                                                <FiSend className="mr-2" /> Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : selectedMessage ? (
                                <div className="w-full md:w-3/5 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
                                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                        <button 
                                            className="md:hidden text-blue-500 hover:text-blue-700 flex items-center"
                                            onClick={() => setSelectedMessage(null)}
                                        >
                                            <FiCornerUpLeft className="mr-1" /> Back
                                        </button>
                                        <div className="flex space-x-2">
                                            {activeTab !== 'sent' && activeTab !== 'forwarded' && (
                                                <>
                                                    <button 
                                                        className={`p-2 rounded-full ${isReplying ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-500 hover:bg-gray-100'}`}
                                                        onClick={handleReply}
                                                        title="Reply"
                                                    >
                                                        <FiCornerUpLeft size={18} />
                                                    </button>
                                                    <button 
                                                        className={`p-2 rounded-full ${isForwarding ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-500 hover:bg-gray-100'}`}
                                                        onClick={handleForward}
                                                        title="Forward"
                                                    >
                                                        <FiCornerUpRight size={18} />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100" title="Archive">
                                                <FiArchive size={18} />
                                            </button>
                                            <button 
                                                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100"
                                                onClick={() => deleteMessage(selectedMessage.id)}
                                                title="Delete"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-xl font-bold text-gray-800">{selectedMessage.subject}</h2>
                                            <button 
                                                onClick={() => toggleStar(selectedMessage.id)}
                                                className="text-gray-400 hover:text-yellow-400 p-1"
                                            >
                                                <FiStar className={selectedMessage.starred ? 'text-yellow-400 fill-yellow-400' : ''} size={20} />
                                            </button>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            {activeTab === 'sent' ? (
                                                <p className="font-medium text-gray-700">To: {selectedMessage.to}</p>
                                            ) : activeTab === 'forwarded' ? (
                                                <>
                                                    <p className="font-medium text-gray-700">To: {selectedMessage.to}</p>
                                                    <p className="mt-1">Original From: {selectedMessage.originalFrom}</p>
                                                </>
                                            ) : (
                                                <p className="font-medium text-gray-700">From: {selectedMessage.from} &lt;{selectedMessage.email}&gt;</p>
                                            )}
                                            <p className="mt-1">Date: {selectedMessage.date} at {selectedMessage.time}</p>
                                        </div>
                                        <div className="mt-6 text-gray-700 whitespace-pre-line">
                                            <p>{selectedMessage.content}</p>
                                        </div>

                                        {/* Replies Section */}
                                        {messageReplies.length > 0 && (
                                            <div className="mt-8 border-t pt-6">
                                                <h3 className="text-lg font-medium text-gray-800 mb-4">Replies ({messageReplies.length})</h3>
                                                {messageReplies.map((reply, index) => (
                                                    <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div>
                                                                <span className="font-medium text-gray-700">{reply.from}</span>
                                                                <span className="text-xs text-gray-500 ml-2">&lt;{reply.email}&gt;</span>
                                                            </div>
                                                            <span className="text-xs text-gray-500">{reply.date} at {reply.time}</span>
                                                        </div>
                                                        <div className="text-gray-700 whitespace-pre-line">
                                                            <p>{reply.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Reply Section */}
                                        {isReplying && (
                                            <div className="mt-8 border-t pt-6">
                                                <h3 className="text-lg font-medium text-gray-800 mb-4">Reply to {selectedMessage.from}</h3>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows="6"
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    placeholder="Type your reply here..."
                                                />
                                                <div className="flex justify-end space-x-3">
                                                    <button 
                                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                                        onClick={() => setIsReplying(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors shadow-md"
                                                        onClick={sendReply}
                                                    >
                                                        <FiSend className="mr-2" /> Send Reply
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Forward Section */}
                                        {isForwarding && (
                                            <div className="mt-8 border-t pt-6">
                                                <h3 className="text-lg font-medium text-gray-800 mb-4">Forward Message</h3>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                                                    <input 
                                                        type="email" 
                                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="recipient@example.com"
                                                        value={forwardRecipient}
                                                        onChange={(e) => setForwardRecipient(e.target.value)}
                                                    />
                                                </div>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows="6"
                                                    value={forwardContent}
                                                    onChange={(e) => setForwardContent(e.target.value)}
                                                    placeholder="Add any additional message..."
                                                />
                                                <div className="flex justify-end space-x-3">
                                                    <button 
                                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                                        onClick={() => setIsForwarding(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors shadow-md"
                                                        onClick={sendForward}
                                                    >
                                                        <FiSend className="mr-2" /> Send Forward
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden md:flex w-3/5 bg-white rounded-lg shadow-sm border border-gray-200 items-center justify-center">
                                    <div className="text-center p-8">
                                        <FiMail size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-500">Select a message to read</h3>
                                        <p className="text-gray-400 mt-2">No message selected</p>
                                        <button
                                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto transition-colors shadow-md"
                                            onClick={handleCompose}
                                        >
                                            <FiEdit className="mr-2" /> Compose New
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Image Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div
                        className="relative bg-white p-4 rounded-lg shadow-lg max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 bg-gray-100 rounded-full p-1"
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

export default Inbox;