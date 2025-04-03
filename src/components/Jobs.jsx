import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEye, FiEdit, FiUsers, FiX, FiSave, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import moment from 'moment';

const Jobs = ({ 
  jobs, 
  onCreateJob, 
  onViewJob, 
  onEditJob,
  onStatusChange,
  hiredCandidates = {}
}) => {
  const [currentJob, setCurrentJob] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [mode, setMode] = useState('create');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'closed', label: 'Closed', color: 'bg-red-100 text-red-800' }
  ];

  const handleCreateJobClick = () => {
    setCurrentJob(null);
    setMode('create');
    setShowJobForm(true);
    onCreateJob?.();
  };

  const handleViewJobClick = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    setCurrentJob(job);
    setMode('view');
    setShowJobForm(true);
    onViewJob?.(jobId);
  };

  const handleEditJobClick = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    setCurrentJob(job);
    setMode('edit');
    setShowJobForm(true);
    onEditJob?.(jobId);
  };

  const handleStatusChange = (jobId, newStatus) => {
    onStatusChange(jobId, newStatus);
    setStatusDropdownOpen(null);
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/job/${jobId}/applicants`);
  };

  const handleSaveJob = (jobData) => {
    if (mode === 'create') {
      onCreateJob?.(jobData);
    } else if (mode === 'edit') {
      onEditJob?.(currentJob.id, jobData);
    }
    setShowJobForm(false);
  };

  const handleCancel = () => {
    setShowJobForm(false);
  };

  if (showJobForm) {
    return (
      <JobForm 
        job={currentJob}
        mode={mode}
        onSave={handleSaveJob}
        onCancel={handleCancel}
        hiredCandidates={currentJob ? hiredCandidates[currentJob.id] || [] : []}
        statusOptions={statusOptions}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Job Postings</h2>
        <button 
          onClick={handleCreateJobClick}
          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus />
          <span>Create Job Posting</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{job.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{job.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{job.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleViewApplicants(job.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <FiUsers className="mr-1" /> {job.applicants} Applicants
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        className={`inline-flex justify-center w-full rounded-full px-3 py-1 text-xs font-medium ${statusOptions.find(s => s.value === job.status)?.color}`}
                        onClick={() => setStatusDropdownOpen(statusDropdownOpen === job.id ? null : job.id)}
                      >
                        {statusOptions.find(s => s.value === job.status)?.label}
                        <FiChevronDown className="ml-1" />
                      </button>
                    </div>
                    {statusDropdownOpen === job.id && (
                      <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          {statusOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleStatusChange(job.id, option.value)}
                              className={`block w-full text-left px-4 py-2 text-sm ${option.value === job.status ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {moment(job.postedDate).fromNow()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewJobClick(job.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3 flex items-center"
                  >
                    <FiEye className="mr-1" /> View
                  </button>
                  <button 
                    onClick={() => handleEditJobClick(job.id)}
                    className="text-gray-600 hover:text-gray-900 flex items-center"
                  >
                    <FiEdit className="mr-1" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const JobForm = ({ 
  job = null, 
  mode = 'create',
  onSave, 
  onCancel,
  hiredCandidates = [],
  statusOptions = []
}) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    department: job?.department || '',
    location: job?.location || '',
    description: job?.description || '',
    requirements: job?.requirements || '',
    status: job?.status || 'draft',
    salaryRange: job?.salaryRange || '',
    employmentType: job?.employmentType || 'full-time',
    experienceLevel: job?.experienceLevel || 'mid',
    educationLevel: job?.educationLevel || 'bachelor'
  });

  const isEditing = mode === 'create' || mode === 'edit';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const employmentTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'temporary', label: 'Temporary' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' }
  ];

  const educationLevels = [
    { value: 'high-school', label: 'High School' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'PhD' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          {mode === 'create' ? 'Create New Job Posting' : 
           mode === 'edit' ? 'Edit Job Posting' : 'Job Posting Details'}
        </h2>
        {mode === 'view' && (
          <button 
            onClick={onCancel}
            className="flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            <FiX />
            <span>Close</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type*</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              required
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {employmentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level*</label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              required
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education Level*</label>
            <select
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              required
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {educationLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={!isEditing}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements*</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              disabled={!isEditing}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiX className="inline mr-1" /> Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSave className="inline mr-1" /> {mode === 'create' ? 'Create' : 'Save'} Job Posting
            </button>
          </div>
        )}
      </form>

      {job && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hired Candidates ({hiredCandidates.length})</h3>
          
          {hiredCandidates.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hiredCandidates.map(candidate => (
                  <div key={candidate.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-500">{candidate.email}</p>
                        <p className="text-sm text-gray-500">{candidate.phone}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <FiCheckCircle className="text-green-500 mr-1" />
                          <span>Hired {moment(candidate.hiredDate).fromNow()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-2 text-sm font-medium text-gray-900">No hired candidates yet</h4>
              <p className="mt-1 text-sm text-gray-500">
                Once you start hiring for this position, hired candidates will appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Jobs;