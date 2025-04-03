import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { FiX } from 'react-icons/fi';
import Pipeline from '../components/Pipeline';
import CalendarView from '../components/CalendarView';
import Analytics from '../components/Analytics';
import Jobs from '../components/Jobs';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Dummy data
const dummyCandidates = [
    {
        id: '1',
        name: 'Aarav Patil',
        position: 'Frontend Developer',
        photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
        appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 3 },
        status: 'applied',
        email: 'aarav.patil@example.com',
        phone: '+91 9876543210',
        rating: 4,
        skills: ['React', 'JavaScript', 'CSS'],
        experience: '3 years',
        isActive: true,
        department: 'Engineering',
        resumeURL: 'https://example.com/resumes/aarav_patil.pdf',
        notes: 'Strong React skills, needs more TypeScript experience',
        source: 'LinkedIn'
    },
    {
        id: '2',
        name: 'Ananya Deshpande',
        position: 'Backend Engineer',
        photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
        appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5 },
        status: 'screening',
        email: 'ananya.deshpande@example.com',
        phone: '+91 8765432109',
        rating: 5,
        skills: ['Node.js', 'Python', 'AWS'],
        experience: '5 years',
        isActive: true,
        department: 'Engineering',
        resumeURL: 'https://example.com/resumes/ananya_deshpande.pdf',
        notes: 'Excellent problem-solving skills',
        source: 'Company Website'
    },
    {
        id: '3',
        name: 'Rohan Joshi',
        position: 'UX Designer',
        photoURL: 'https://randomuser.me/api/portraits/men/55.jpg',
        appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2 },
        status: 'interview',
        email: 'rohan.joshi@example.com',
        phone: '+91 7654321098',
        rating: 3,
        skills: ['Figma', 'User Research', 'Prototyping'],
        experience: '4 years',
        isActive: true,
        department: 'Design',
        resumeURL: 'https://example.com/resumes/rohan_joshi.pdf',
        notes: 'Portfolio shows strong visual design skills',
        source: 'Referral'
    },
    {
        id: '4',
        name: 'Priya Kulkarni',
        position: 'Product Manager',
        photoURL: 'https://randomuser.me/api/portraits/women/68.jpg',
        appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7 },
        status: 'offer',
        email: 'priya.kulkarni@example.com',
        phone: '+91 6543210987',
        rating: 4,
        skills: ['Agile', 'Product Strategy', 'Roadmapping'],
        experience: '6 years',
        isActive: false,
        department: 'Product',
        resumeURL: 'https://example.com/resumes/priya_kulkarni.pdf',
        notes: 'Previous experience at FAANG company',
        source: 'LinkedIn'
    },
    {
        id: '5',
        name: 'Siddharth Chavan',
        position: 'Data Scientist',
        photoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
        appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 10 },
        status: 'hired',
        email: 'siddharth.chavan@example.com',
        phone: '+91 5432109876',
        rating: 5,
        skills: ['Python', 'Machine Learning', 'SQL'],
        experience: '4 years',
        isActive: false,
        department: 'Data Science',
        resumeURL: 'https://example.com/resumes/siddharth_chavan.pdf',
        notes: 'Strong academic background in ML',
        source: 'Job Board'
    },
    {
        id: '6',
        name: 'Meera Iyer',
        position: 'HR Specialist',
        photoURL: 'https://randomuser.me/api/portraits/women/33.jpg',
        appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 1 },
        status: 'applied',
        email: 'meera.iyer@example.com',
        phone: '+91 4321098765',
        rating: 4,
        skills: ['Recruitment', 'Employee Relations', 'Onboarding'],
        experience: '3 years',
        isActive: true,
        department: 'HR',
        resumeURL: 'https://example.com/resumes/meera_iyer.pdf',
        notes: 'Certified HR professional',
        source: 'Referral'
    },
    {
        id: '7',
        name: 'Vikram Naik',
        position: 'Marketing Manager',
        photoURL: 'https://randomuser.me/api/portraits/men/45.jpg',
        appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 4 },
        status: 'screening',
        email: 'vikram.naik@example.com',
        phone: '+91 3210987654',
        rating: 5,
        skills: ['Digital Marketing', 'Brand Strategy', 'Content Creation'],
        experience: '7 years',
        isActive: true,
        department: 'Marketing',
        resumeURL: 'https://example.com/resumes/vikram_naik.pdf',
        notes: 'Experience with SaaS marketing',
        source: 'Company Website'
    },
    {
        id: '8',
        name: 'Aditi Pawar',
        position: 'DevOps Engineer',
        photoURL: 'https://randomuser.me/api/portraits/women/25.jpg',
        appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 6 },
        status: 'interview',
        email: 'aditi.pawar@example.com',
        phone: '+91 2109876543',
        rating: 4,
        skills: ['Docker', 'Kubernetes', 'CI/CD'],
        experience: '5 years',
        isActive: true,
        department: 'Engineering',
        resumeURL: 'https://example.com/resumes/aditi_pawar.pdf',
        notes: 'Strong cloud infrastructure knowledge',
        source: 'Job Board'
    },
    {
        id: '9',
        name: 'Rajesh More',
        position: 'Content Writer',
        photoURL: 'https://randomuser.me/api/portraits/men/75.jpg',
        appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2 },
        status: 'applied',
        email: 'rajesh.more@example.com',
        phone: '+91 1098765432',
        rating: 3,
        skills: ['Content Strategy', 'SEO', 'Copywriting'],
        experience: '2 years',
        isActive: true,
        department: 'Marketing',
        resumeURL: 'https://example.com/resumes/rajesh_more.pdf',
        notes: 'Portfolio shows versatile writing style',
        source: 'LinkedIn'
    },
    {
        id: '10',
        name: 'Neha Sharma',
        position: 'QA Engineer',
        photoURL: 'https://randomuser.me/api/portraits/women/63.jpg',
        appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 8 },
        status: 'offer',
        email: 'neha.sharma@example.com',
        phone: '+91 0987654321',
        rating: 4,
        skills: ['Automated Testing', 'Selenium', 'JIRA'],
        experience: '4 years',
        isActive: false,
        department: 'Engineering',
        resumeURL: 'https://example.com/resumes/neha_sharma.pdf',
        notes: 'Experience with test automation frameworks',
        source: 'Referral'
    },
    {id: '11',
    name: 'Arjun Deshmukh',
    position: 'Full Stack Developer',
    photoURL: 'https://randomuser.me/api/portraits/men/41.jpg',
    appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 4 },
    status: 'screening',
    email: 'arjun.deshmukh@example.com',
    phone: '+91 9876543211',
    rating: 4,
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    experience: '4 years',
    isActive: true,
    department: 'Engineering',
    resumeURL: 'https://example.com/resumes/arjun_deshmukh.pdf',
    notes: 'Strong full-stack capabilities',
    source: 'LinkedIn'
  },
  {
    id: '12',
    name: 'Pooja Kulkarni',
    position: 'HR Recruiter',
    photoURL: 'https://randomuser.me/api/portraits/women/51.jpg',
    appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2 },
    status: 'interview',
    email: 'pooja.kulkarni@example.com',
    phone: '+91 8765432110',
    rating: 5,
    skills: ['Talent Acquisition', 'Interviewing', 'ATS'],
    experience: '5 years',
    isActive: true,
    department: 'HR',
    resumeURL: 'https://example.com/resumes/pooja_kulkarni.pdf',
    notes: 'Specializes in tech recruitment',
    source: 'Referral'
  },
  {
    id: '13',
    name: 'Rahul Jadhav',
    position: 'DevOps Engineer',
    photoURL: 'https://randomuser.me/api/portraits/men/62.jpg',
    appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 6 },
    status: 'offer',
    email: 'rahul.jadhav@example.com',
    phone: '+91 7654321099',
    rating: 4,
    skills: ['AWS', 'Terraform', 'CI/CD'],
    experience: '3 years',
    isActive: false,
    department: 'Engineering',
    resumeURL: 'https://example.com/resumes/rahul_jadhav.pdf',
    notes: 'Certified AWS Solutions Architect',
    source: 'Job Board'
  },
  {
    id: '14',
    name: 'Anjali Patil',
    position: 'Product Designer',
    photoURL: 'https://randomuser.me/api/portraits/women/72.jpg',
    appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 1 },
    status: 'applied',
    email: 'anjali.patil@example.com',
    phone: '+91 6543210988',
    rating: 5,
    skills: ['Figma', 'User Research', 'Prototyping'],
    experience: '2 years',
    isActive: true,
    department: 'Design',
    resumeURL: 'https://example.com/resumes/anjali_patil.pdf',
    notes: 'Strong portfolio with fintech projects',
    source: 'Company Website'
  },
  {
    id: '15',
    name: 'Suresh Iyer',
    position: 'Data Analyst',
    photoURL: 'https://randomuser.me/api/portraits/men/35.jpg',
    appliedDate: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5 },
    status: 'hired',
    email: 'suresh.iyer@example.com',
    phone: '+91 5432109877',
    rating: 4,
    skills: ['SQL', 'Python', 'Tableau'],
    experience: '3 years',
    isActive: false,
    department: 'Data Science',
    resumeURL: 'https://example.com/resumes/suresh_iyer.pdf',
    notes: 'Strong analytical skills',
    source: 'LinkedIn'
  }
];

const dummyJobs = [
    {
        id: '1',
        title: 'Frontend Developer',
        department: 'Engineering',
        location: 'Pune',
        applicants: 24,
        status: 'active',
        postedDate: '2023-05-15',
        type: 'Full-time',
        salary: '₹8,00,000 - ₹12,00,000',
        description: 'We are looking for a skilled Frontend Developer to join our team in Pune.',
        requirements: [
            '3+ years of React experience',
            'Strong JavaScript skills',
            'CSS expertise',
            'Experience with state management (Redux/MobX)',
            'Familiarity with TypeScript',
            'Understanding of RESTful APIs'
        ],
        responsibilities: [
            'Develop new user-facing features',
            'Build reusable components and front-end libraries',
            'Optimize components for maximum performance',
            'Collaborate with UX designers and backend developers',
            'Participate in code reviews'
        ],
        benefits: [
            'Health insurance',
            'PF matching',
            'Flexible work hours',
            'Remote work options',
            'Professional development budget'
        ]
    },
    {
        id: '2',
        title: 'UX Designer',
        department: 'Design',
        location: 'Mumbai',
        applicants: 18,
        status: 'active',
        postedDate: '2023-06-01',
        type: 'Full-time',
        salary: '₹7,50,000 - ₹10,00,000',
        description: 'Join our design team in Mumbai to create amazing user experiences.',
        requirements: [
            'Portfolio required',
            'Figma expertise',
            'User research skills',
            '3+ years of UX design experience',
            'Understanding of design systems',
            'Collaboration skills'
        ],
        responsibilities: [
            'Conduct user research',
            'Create wireframes and prototypes',
            'Design user interfaces',
            'Collaborate with product managers and developers',
            'Contribute to design system'
        ],
        benefits: [
            'Health insurance',
            'Dental and vision coverage',
            'Commuter benefits',
            'Annual design conference budget',
            'Flexible PTO'
        ]
    },
    {
        id: '3',
        title: 'Backend Developer',
        department: 'Engineering',
        location: 'Bangalore',
        applicants: 32,
        status: 'paused',
        postedDate: '2023-04-20',
        type: 'Full-time',
        salary: '₹10,00,000 - ₹14,00,000',
        description: 'Looking for backend engineers to build our API infrastructure in Bangalore.',
        requirements: [
            'Node.js or Python experience',
            'AWS knowledge',
            'Database skills',
            'Experience with microservices',
            'Understanding of security best practices',
            'CI/CD experience'
        ],
        responsibilities: [
            'Design and implement APIs',
            'Optimize database queries',
            'Improve system performance',
            'Write unit and integration tests',
            'Participate in on-call rotation'
        ],
        benefits: [
            'Competitive salary',
            'ESOPs',
            'Health and wellness benefits',
            'Home office stipend',
            'Learning budget'
        ]
    },
    {
        id: '4',
        title: 'Mobile Developer (React Native)',
        department: 'Engineering',
        location: 'Hyderabad',
        applicants: 15,
        status: 'active',
        postedDate: '2023-06-10',
        type: 'Full-time',
        salary: '₹9,00,000 - ₹13,00,000',
        description: 'Looking for React Native developers to build our mobile applications.',
        requirements: [
          '2+ years React Native experience',
          'JavaScript/TypeScript proficiency',
          'Native mobile development knowledge',
          'Redux/MobX experience',
          'REST API integration'
        ],
        responsibilities: [
          'Develop mobile applications',
          'Collaborate with UI/UX designers',
          'Write clean, maintainable code',
          'Participate in code reviews',
          'Optimize app performance'
        ],
        benefits: [
          'Health insurance',
          'Flexible hours',
          'Remote work options',
          'Mobile device stipend',
          'Conference budget'
        ]
      },
      {
        id: '5',
        title: 'HR Business Partner',
        department: 'Human Resources',
        location: 'Delhi',
        applicants: 8,
        status: 'active',
        postedDate: '2023-06-05',
        type: 'Full-time',
        salary: '₹12,00,000 - ₹16,00,000',
        description: 'Strategic HR partner needed for our growing organization.',
        requirements: [
          '5+ years HR experience',
          'Employee relations expertise',
          'Talent management skills',
          'HR certification preferred',
          'Strong communication skills'
        ],
        responsibilities: [
          'Partner with business leaders',
          'Develop HR strategies',
          'Handle employee relations',
          'Drive talent initiatives',
          'Implement HR policies'
        ],
        benefits: [
          'Competitive salary',
          'Performance bonuses',
          'Health benefits',
          'Professional development',
          'Flexible work arrangements'
        ]
      }
];

const Hiring = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [candidates, setCandidates] = useState(dummyCandidates);
  const [jobs, setJobs] = useState(dummyJobs);
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Dummy interviews data
  const [interviews] = useState([
    {
        id: '1',
        candidateId: '3',
        candidateName: 'Rohan Joshi',
        position: 'UX Designer',
        interviewer: 'Vikram Naik',
        start: new Date(Date.now() + 86400 * 1000 * 1.5),
        end: new Date(Date.now() + 86400 * 1000 * 1.75),
        status: 'scheduled',
        location: 'Conference Room B',
        notes: 'Focus on portfolio review',
        feedback: '',
        interviewType: 'Technical'
    },
    {
        id: '2',
        candidateId: '2',
        candidateName: 'Ananya Deshpande',
        position: 'Backend Engineer',
        interviewer: 'Aditi Pawar',
        start: new Date(Date.now() - 86400 * 1000 * 0.5),
        end: new Date(Date.now() - 86400 * 1000 * 0.25),
        status: 'completed',
        location: 'Zoom Meeting',
        notes: 'Technical assessment passed',
        feedback: 'Strong problem-solving skills. Recommended for next round.',
        interviewType: 'Technical'
    },
    {
        id: '3',
        candidateId: '8',
        candidateName: 'Aditi Pawar',
        position: 'DevOps Engineer',
        interviewer: 'Siddharth Chavan',
        start: new Date(Date.now() + 86400 * 1000 * 2),
        end: new Date(Date.now() + 86400 * 1000 * 2.5),
        status: 'scheduled',
        location: 'Zoom Meeting',
        notes: 'System architecture discussion',
        feedback: '',
        interviewType: 'Technical'
      },
      {
        id: '4',
        candidateId: '12',
        candidateName: 'Pooja Kulkarni',
        position: 'HR Recruiter',
        interviewer: 'Meera Iyer',
        start: new Date(Date.now() + 86400 * 1000 * 3),
        end: new Date(Date.now() + 86400 * 1000 * 3.5),
        status: 'scheduled',
        location: 'Conference Room A',
        notes: 'Behavioral and situational questions',
        feedback: '',
        interviewType: 'HR'
      },
      {
        id: '5',
        candidateId: '14',
        candidateName: 'Anjali Patil',
        position: 'Product Designer',
        interviewer: 'Rohan Joshi',
        start: new Date(Date.now() - 86400 * 1000 * 1),
        end: new Date(Date.now() - 86400 * 1000 * 0.5),
        status: 'completed',
        location: 'Conference Room C',
        notes: 'Design critique session',
        feedback: 'Excellent design thinking skills. Recommended for next round.',
        interviewType: 'Design'
      }
  ]);

  // Get hired candidates
  const hiredCandidates = candidates.filter(candidate => candidate.status === 'hired');

  // Fetch user data from Firebase
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
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleMoveCandidate = (candidateId, direction) => {
    const statusOrder = ['applied', 'screening', 'interview', 'offer', 'hired'];
    setCandidates(prev => prev.map(candidate => {
      if (candidate.id === candidateId) {
        const currentIndex = statusOrder.indexOf(candidate.status);
        let newIndex = currentIndex;
        
        if (direction === 'next' && currentIndex < statusOrder.length - 1) {
          newIndex = currentIndex + 1;
        } else if (direction === 'previous' && currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
        
        return { ...candidate, status: statusOrder[newIndex] };
      }
      return candidate;
    }));
  };

  const handleAddCandidate = () => {
    navigate('/add-candidate', {
      state: {
        onCandidateAdded: (newCandidate) => {
          setCandidates([...candidates, newCandidate]);
        }
      }
    });
  };

  const handleCreateJob = () => {
    navigate('/create-job', {
      state: {
        onJobCreated: (newJob) => {
          setJobs([...jobs, newJob]);
        }
      }
    });
  };

  const handleViewJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    navigate(`/job/${jobId}`, { state: { job } });
  };

  const handleEditJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    navigate(`/edit-job/${jobId}`, { 
      state: { 
        job,
        onJobUpdated: (updatedJob) => {
          setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
        }
      } 
    });
  };

  const handleStatusChange = (jobId, newStatus) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar userData={userData} handleLogout={handleLogout} openModal={openModal} />
      
      <div className="flex-1 overflow-hidden">
        <Navbar />
        <div className="p-6 overflow-auto h-[calc(100vh-64px)]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Hiring Dashboard</h1>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['pipeline', 'calendar', 'analytics', 'jobs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'pipeline' ? (
            <Pipeline 
              candidates={candidates} 
              onMoveCandidate={handleMoveCandidate}
              onAddCandidate={handleAddCandidate}
            />
          ) : activeTab === 'calendar' ? (
            <CalendarView 
              interviews={interviews}
              onScheduleInterview={() => {
                // Handle schedule interview action
                console.log('Schedule new interview');
                // You can navigate to a schedule interview page here if needed
                // navigate('/schedule-interview');
              }}
              onViewInterview={(id) => {
                // Handle view interview action
                console.log(`View interview ${id}`);
                // You can navigate to an interview details page here if needed
                // navigate(`/interview/${id}`);
              }} 
            />
          ) : activeTab === 'analytics' ? (
            <Analytics candidates={candidates} jobs={jobs} />
          ) : (
            <Jobs 
              jobs={jobs} 
              onCreateJob={handleCreateJob}
              onViewJob={handleViewJob}
              onEditJob={handleEditJob}
              onStatusChange={handleStatusChange}
              hiredCandidates={hiredCandidates}
            />
          )}
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

export default Hiring;