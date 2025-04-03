import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import moment from 'moment';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Analytics = ({ candidates, jobs }) => {
    // State for filters and views
    const [statusFilter, setStatusFilter] = useState(null);
    const [departmentFilter, setDepartmentFilter] = useState(null);
    const [showAllApplicants, setShowAllApplicants] = useState(false);
    const [showAllRecent, setShowAllRecent] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'appliedDate', direction: 'desc' });
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    // Sort candidates
    const sortedCandidates = [...candidates].sort((a, b) => {
        if (sortConfig.key === 'appliedDate') {
            const aDate = a.appliedDate?.seconds || 0;
            const bDate = b.appliedDate?.seconds || 0;
            return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
        } else {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        }
    });

    // Filter candidates based on current filters
    const filteredCandidates = sortedCandidates.filter(c => {
        return (!statusFilter || c.status === statusFilter) && 
               (!departmentFilter || c.department === departmentFilter);
    });

    // Group candidates by status
    const statusGroups = {
        applied: candidates.filter(c => c.status === 'applied'),
        screening: candidates.filter(c => c.status === 'screening'),
        interview: candidates.filter(c => c.status === 'interview'),
        offer: candidates.filter(c => c.status === 'offer'),
        hired: candidates.filter(c => c.status === 'hired')
    };

    const pipelineStages = [
        { name: 'New Applicants', candidates: statusGroups.applied, status: 'applied', color: 'blue' },
        { name: 'Screening', candidates: statusGroups.screening, status: 'screening', color: 'purple' },
        { name: 'Interview', candidates: statusGroups.interview, status: 'interview', color: 'yellow' },
        { name: 'Offer', candidates: statusGroups.offer, status: 'offer', color: 'green' },
        { name: 'Hired', candidates: statusGroups.hired, status: 'hired', color: 'gray' }
    ];

    // Calculate average time to hire
    const hiredCandidatesWithDates = candidates.filter(c => 
        c.status === 'hired' && c.appliedDate && c.hiredDate
    );
    
    const avgTimeToHire = hiredCandidatesWithDates.length > 0
        ? Math.round(
            hiredCandidatesWithDates.reduce((total, c) => {
                const applied = moment.unix(c.appliedDate.seconds);
                const hired = moment.unix(c.hiredDate.seconds);
                return total + hired.diff(applied, 'days');
            }, 0) / hiredCandidatesWithDates.length
        )
        : null;

    // Departments data
    const departments = [...new Set(candidates.map(c => c.department))];
    const departmentHires = departments.map(dept => ({
        name: dept,
        count: candidates.filter(c => c.department === dept && c.status === 'hired').length
    }));

    // Pipeline conversion rates
    const conversionRates = {
        appliedToScreening: statusGroups.screening.length / (statusGroups.applied.length || 1),
        screeningToInterview: statusGroups.interview.length / (statusGroups.screening.length || 1),
        interviewToOffer: statusGroups.offer.length / (statusGroups.interview.length || 1),
        offerToHire: statusGroups.hired.length / (statusGroups.offer.length || 1)
    };

    // Chart data configurations
    const pipelineData = {
        labels: pipelineStages.map(stage => stage.name),
        datasets: [
            {
                label: 'Candidates',
                data: pipelineStages.map(stage => stage.candidates.length),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(234, 179, 8, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(156, 163, 175, 0.7)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(156, 163, 175, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const departmentData = {
        labels: departmentHires.map(dept => dept.name),
        datasets: [
            {
                label: 'Hires by Department',
                data: departmentHires.map(dept => dept.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Clear all filters
    const clearFilters = () => {
        setStatusFilter(null);
        setDepartmentFilter(null);
    };

    // Handle clicking on a pipeline stage
    const handlePipelineClick = (status) => {
        setStatusFilter(status);
        setDepartmentFilter(null);
    };

    // Handle clicking on a department
    const handleDepartmentClick = (department) => {
        setDepartmentFilter(department);
        setStatusFilter(null);
    };

    // Handle viewing candidate details
    const handleViewDetails = (candidate) => {
        setSelectedCandidate(candidate);
    };

    // Close candidate details modal
    const closeDetailsModal = () => {
        setSelectedCandidate(null);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Hiring Analytics Dashboard</h2>
                {(statusFilter || departmentFilter) && (
                    <button 
                        onClick={clearFilters}
                        className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-gray-700 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear filters
                    </button>
                )}
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Total Applicants Card */}
                <div 
                    className={`bg-white p-5 rounded-xl border ${
                        showAllApplicants ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    } shadow-xs cursor-pointer transition-all hover:shadow-md`}
                    onClick={() => setShowAllApplicants(!showAllApplicants)}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Total Applicants</h3>
                            <p className="text-3xl font-bold mt-2 text-gray-800">{candidates.length}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            showAllApplicants ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                            {showAllApplicants ? 'Viewing All' : 'Click to View'}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
                </div>

                {/* Hiring Rate Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                    <h3 className="text-gray-500 text-sm font-medium">Hiring Rate</h3>
                    <p className="text-3xl font-bold mt-2 text-gray-800">
                        {candidates.length > 0 ? Math.round((statusGroups.hired.length / candidates.length) * 100) : 0}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Industry avg: 20%</p>
                </div>

                {/* Avg. Time to Hire Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                    <h3 className="text-gray-500 text-sm font-medium">Avg. Time to Hire</h3>
                    <p className="text-3xl font-bold mt-2 text-gray-800">
                        {avgTimeToHire !== null ? `${avgTimeToHire} days` : '24 days'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {hiredCandidatesWithDates.length > 0 
                            ? `Based on ${hiredCandidatesWithDates.length} hires`
                            : '-3 days from last quarter'}
                    </p>
                </div>

                {/* Active Jobs Card */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                    <h3 className="text-gray-500 text-sm font-medium">Active Jobs</h3>
                    <p className="text-3xl font-bold mt-2 text-gray-800">
                        {jobs.filter(job => job.status === 'active').length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{jobs.length} total postings</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Pipeline Conversion Chart */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                    <h3 className="text-gray-500 text-sm font-medium mb-4">Pipeline Conversion</h3>
                    <div className="h-64">
                        <Pie 
                            data={pipelineData}
                            options={{
                                responsive: true,
                                onClick: (e, elements) => {
                                    if (elements.length > 0) {
                                        const index = elements[0].index;
                                        handlePipelineClick(pipelineStages[index].status);
                                    }
                                },
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                const stage = pipelineStages[context.dataIndex];
                                                const percentage = Math.round((stage.candidates.length / candidates.length) * 100) || 0;
                                                return `${context.label}: ${context.raw} candidates (${percentage}%)`;
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
                        {pipelineStages.map((stage, i) => (
                            <div key={i}>
                                <div className="font-medium">{stage.name}</div>
                                <div className="text-gray-500">{stage.candidates.length}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Department Hiring Chart */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                    <h3 className="text-gray-500 text-sm font-medium mb-4">Hiring by Department</h3>
                    <div className="h-64">
                        <Bar 
                            data={departmentData}
                            options={{
                                responsive: true,
                                onClick: (e, elements) => {
                                    if (elements.length > 0) {
                                        const index = elements[0].index;
                                        handleDepartmentClick(departmentHires[index].name);
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                return `${context.raw} hire${context.raw !== 1 ? 's' : ''}`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            precision: 0
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Conversion Rates Section */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs mb-6">
                <h3 className="text-gray-500 text-sm font-medium mb-4">Conversion Rates</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-800 font-medium">Applied → Screening</div>
                        <div className="text-2xl font-bold text-blue-900">
                            {Math.round(conversionRates.appliedToScreening * 100)}%
                        </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-purple-800 font-medium">Screening → Interview</div>
                        <div className="text-2xl font-bold text-purple-900">
                            {Math.round(conversionRates.screeningToInterview * 100)}%
                        </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-sm text-yellow-800 font-medium">Interview → Offer</div>
                        <div className="text-2xl font-bold text-yellow-900">
                            {Math.round(conversionRates.interviewToOffer * 100)}%
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-800 font-medium">Offer → Hired</div>
                        <div className="text-2xl font-bold text-green-900">
                            {Math.round(conversionRates.offerToHire * 100)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Applicants Table */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">
                        {statusFilter ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Candidates` : 
                         departmentFilter ? `${departmentFilter} Candidates` : 
                         'Recent Applicants'}
                    </h3>
                    <button 
                        onClick={() => setShowAllRecent(!showAllRecent)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        {showAllRecent ? 'Show Less' : 'View All'}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('name')}
                                >
                                    <div className="flex items-center">
                                        Candidate
                                        {sortConfig.key === 'name' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('appliedDate')}
                                >
                                    <div className="flex items-center">
                                        Applied
                                        {sortConfig.key === 'appliedDate' && (
                                            <span className="ml-1">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(showAllRecent ? filteredCandidates : filteredCandidates.slice(0, 5)).map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-gray-50">
                                    <td 
                                        className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                        onClick={() => handleViewDetails(candidate)}
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={candidate.photoURL || '/default-avatar.png'} alt={candidate.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                                <div className="text-sm text-gray-500">{candidate.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            candidate.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                                            candidate.status === 'screening' ? 'bg-purple-100 text-purple-800' :
                                            candidate.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                                            candidate.status === 'offer' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {candidate.appliedDate ? moment.unix(candidate.appliedDate.seconds).fromNow() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            {candidate.resumeURL && (
                                                <a 
                                                    href={candidate.resumeURL} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="View Resume"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </a>
                                            )}
                                            <button 
                                                onClick={() => handleViewDetails(candidate)}
                                                className="text-gray-600 hover:text-gray-900"
                                                title="View Details"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* All Applicants Modal */}
            {showAllApplicants && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center border-b p-4">
                            <h3 className="text-lg font-medium text-gray-900">All Applicants ({candidates.length})</h3>
                            <button 
                                onClick={() => setShowAllApplicants(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('name')}
                                        >
                                            <div className="flex items-center">
                                                Candidate
                                                {sortConfig.key === 'name' && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('appliedDate')}
                                        >
                                            <div className="flex items-center">
                                                Applied
                                                {sortConfig.key === 'appliedDate' && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedCandidates.map((candidate) => (
                                        <tr key={candidate.id} className="hover:bg-gray-50">
                                            <td 
                                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                                onClick={() => handleViewDetails(candidate)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full" src={candidate.photoURL || '/default-avatar.png'} alt={candidate.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                                        <div className="text-sm text-gray-500">{candidate.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {candidate.position}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {candidate.department}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    candidate.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                                                    candidate.status === 'screening' ? 'bg-purple-100 text-purple-800' :
                                                    candidate.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                                                    candidate.status === 'offer' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {candidate.appliedDate ? moment.unix(candidate.appliedDate.seconds).format('MMM D, YYYY') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex space-x-2">
                                                    {candidate.resumeURL && (
                                                        <a href={candidate.resumeURL} target="_blank" rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800" title="View Resume">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                    <button 
                                                        onClick={() => handleViewDetails(candidate)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                        title="View Details"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t p-4 flex justify-end">
                            <button
                                onClick={() => setShowAllApplicants(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Candidate Details Modal */}
            {selectedCandidate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center border-b p-4">
                            <h3 className="text-lg font-medium text-gray-900">Candidate Details</h3>
                            <button 
                                onClick={closeDetailsModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6">
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                <div className="flex-shrink-0">
                                    <img 
                                        className="h-32 w-32 rounded-full object-cover" 
                                        src={selectedCandidate.photoURL || '/default-avatar.png'} 
                                        alt={selectedCandidate.name} 
                                    />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedCandidate.name}</h2>
                                    <p className="text-gray-600 mb-2">{selectedCandidate.email}</p>
                                    <p className="text-gray-600 mb-2">{selectedCandidate.phone || 'Phone not provided'}</p>
                                    
                                    <div className="mt-4">
                                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                            selectedCandidate.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                                            selectedCandidate.status === 'screening' ? 'bg-purple-100 text-purple-800' :
                                            selectedCandidate.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedCandidate.status === 'offer' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {selectedCandidate.status.charAt(0).toUpperCase() + selectedCandidate.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Position Applied</h4>
                                    <p className="text-gray-800">{selectedCandidate.position}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Department</h4>
                                    <p className="text-gray-800">{selectedCandidate.department}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Date Applied</h4>
                                    <p className="text-gray-800">
                                        {selectedCandidate.appliedDate ? 
                                            moment.unix(selectedCandidate.appliedDate.seconds).format('MMMM D, YYYY') : 
                                            'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Experience</h4>
                                    <p className="text-gray-800">
                                        {selectedCandidate.experience || 'Not specified'}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCandidate.skills?.length > 0 ? (
                                        selectedCandidate.skills.map((skill, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No skills listed</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                                <p className="text-gray-800 whitespace-pre-line">
                                    {selectedCandidate.notes || 'No notes available'}
                                </p>
                            </div>

                            {selectedCandidate.resumeURL && (
                                <div className="flex justify-center">
                                    <a 
                                        href={selectedCandidate.resumeURL} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        View Full Resume
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="border-t p-4 flex justify-end">
                            <button
                                onClick={closeDetailsModal}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;