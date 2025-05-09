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
    }
];