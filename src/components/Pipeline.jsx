import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaUserTie, FaCalendarAlt, FaStar, FaArrowRight, FaArrowLeft, FaFilePdf, FaTrash } from 'react-icons/fa';
import { FiFilter, FiSearch, FiPlus, FiUpload } from 'react-icons/fi';

const CandidateProfileModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.position}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="col-span-1">
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mx-auto">
                {candidate.photoURL ? (
                  <img src={candidate.photoURL} alt={candidate.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-gray-500 text-4xl font-medium">
                    {candidate.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{candidate.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p>{candidate.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className={`inline-block px-2 py-1 rounded-full text-xs ${
                    candidate.status === 'hired' ? 'bg-green-100 text-green-800' :
                    candidate.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                    candidate.status === 'offer' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {candidate.status}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Applied Date</h3>
                  <p>{new Date(candidate.appliedDate?.seconds * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Experience</h3>
            <p>{candidate.experience}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="whitespace-pre-line">{candidate.notes}</p>
          </div>

          <div className="flex justify-end space-x-3">
            <a href={`tel:${candidate.phone}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <FaPhone className="mr-2" /> Call
            </a>
            <a href={`mailto:${candidate.email}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
              <FaEnvelope className="mr-2" /> Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScheduleInterviewModal = ({ candidate, onClose, onSchedule }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [interviewType, setInterviewType] = useState('technical');
  const [interviewer, setInterviewer] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const interviewDetails = {
      candidateId: candidate.id,
      candidateName: candidate.name,
      position: candidate.position,
      date,
      time,
      interviewType,
      interviewer,
      notes,
      start: new Date(`${date}T${time}`),
      status: 'scheduled'
    };
    onSchedule(interviewDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Schedule Interview</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="mb-4">
            <p className="font-medium">{candidate.name}</p>
            <p className="text-gray-600">{candidate.position}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time*</label>
                <input
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type*</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                >
                  <option value="technical">Technical</option>
                  <option value="hr">HR</option>
                  <option value="managerial">Managerial</option>
                  <option value="cultural">Cultural Fit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer*</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Schedule Interview
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AddCandidateModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    status: 'applied',
    notes: '',
    resume: null,
    resumeName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        resume: file,
        resumeName: file.name
      }));
    }
  };

  const removeResume = () => {
    setFormData(prev => ({
      ...prev,
      resume: null,
      resumeName: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCandidate = {
      ...formData,
      id: Date.now().toString(),
      appliedDate: { seconds: Math.floor(Date.now() / 1000) },
      isActive: true,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      rating: Math.floor(Math.random() * 5) + 1,
      resumeURL: formData.resume ? URL.createObjectURL(formData.resume) : null
    };
    onAdd(newCandidate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Add New Candidate</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position*</label>
                <input
                  type="text"
                  name="position"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)*</label>
              <input
                type="text"
                name="skills"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.skills}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience*</label>
              <input
                type="text"
                name="experience"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF only)</label>
              {formData.resume ? (
                <div className="flex items-center justify-between p-2 border border-gray-300 rounded-md">
                  <div className="flex items-center">
                    <FaFilePdf className="text-red-500 mr-2" />
                    <span className="text-sm">{formData.resumeName}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={removeResume}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500">
                  <div className="flex flex-col items-center">
                    <FiUpload className="w-6 h-6 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF (max. 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf"
                    onChange={handleResumeChange}
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Candidate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const CandidateCard = ({ candidate, onMoveCandidate, onViewProfile, onScheduleInterview, interviews }) => {
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} text-xs`}
          />
        ))}
      </div>
    );
  };

  const scheduledInterview = interviews.find(i => i.candidateId === candidate.id);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3 mb-3">
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {candidate.photoURL ? (
              <img src={candidate.photoURL} alt={candidate.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-gray-500 text-lg font-medium">
                {candidate.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {candidate.isActive && (
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-sm">{candidate.name}</h4>
              <p className="text-xs text-gray-500 flex items-center">
                <FaUserTie className="mr-1" />
                {candidate.position}
              </p>
            </div>
            {candidate.rating && renderRating(candidate.rating)}
          </div>
          
          <div className="flex justify-between items-center text-xs mt-2">
            <span className="text-gray-500 flex items-center">
              <FaCalendarAlt className="mr-1" />
              Applied: {new Date(candidate.appliedDate?.seconds * 1000).toLocaleDateString()}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              candidate.status === 'hired' ? 'bg-green-100 text-green-800' :
              candidate.status === 'interview' ? 'bg-blue-100 text-blue-800' :
              candidate.status === 'offer' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {candidate.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
        <div className="flex space-x-2">
          <a 
            href={`tel:${candidate.phone}`} 
            className="text-xs p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
            title="Call candidate"
          >
            <FaPhone />
          </a>
          <a 
            href={`mailto:${candidate.email}`} 
            className="text-xs p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100"
            title="Email candidate"
          >
            <FaEnvelope />
          </a>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onViewProfile(candidate)}
            className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            View Profile
          </button>
          {candidate.status === 'screening' && (
            <button
              onClick={() => onScheduleInterview(candidate)}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Schedule
            </button>
          )}
        </div>
      </div>

      {scheduledInterview && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center text-blue-600">
            <FaCalendarAlt className="mr-1" />
            <span>Scheduled: {new Date(scheduledInterview.start).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-2 border-t pt-2">
        {candidate.status !== 'applied' && (
          <button 
            onClick={() => onMoveCandidate(candidate.id, 'previous')}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
          >
            <FaArrowLeft className="mr-1" /> Prev Stage
          </button>
        )}
        {candidate.status !== 'hired' && (
          <button 
            onClick={() => onMoveCandidate(candidate.id, 'next')}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
          >
            Next Stage <FaArrowRight className="ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

const Pipeline = ({ candidates: initialCandidates, onMoveCandidate: parentMoveCandidate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [candidates, setCandidates] = useState(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [interviews, setInterviews] = useState([]);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = selectedPosition === 'all' || 
                          candidate.position.toLowerCase().includes(selectedPosition.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || candidate.status === selectedStatus;
    return matchesSearch && matchesPosition && matchesStatus;
  });

  const newApplicants = filteredCandidates.filter(c => c.status === 'applied');
  const screening = filteredCandidates.filter(c => c.status === 'screening');
  const interviewStage = filteredCandidates.filter(c => c.status === 'interview');
  const offerStage = filteredCandidates.filter(c => c.status === 'offer');
  const hired = filteredCandidates.filter(c => c.status === 'hired');

  const pipelineStages = [
    { name: 'New Applicants', candidates: newApplicants, color: 'blue' },
    { name: 'Screening', candidates: screening, color: 'purple' },
    { name: 'Interview', candidates: interviewStage, color: 'yellow' },
    { name: 'Offer', candidates: offerStage, color: 'green' },
    { name: 'Hired', candidates: hired, color: 'gray' }
  ];

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
        
        const updatedCandidate = { ...candidate, status: statusOrder[newIndex] };
        if (parentMoveCandidate) {
          parentMoveCandidate(updatedCandidate);
        }
        return updatedCandidate;
      }
      return candidate;
    }));
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setShowProfileModal(true);
  };

  const handleScheduleInterview = (candidate) => {
    if (candidate.status !== 'screening') return;
    setSelectedCandidate(candidate);
    setShowScheduleModal(true);
  };

  const handleAddNewCandidate = () => {
    setShowAddCandidateModal(true);
  };

  const handleAddCandidate = (newCandidate) => {
    setCandidates(prev => [...prev, newCandidate]);
    setShowAddCandidateModal(false);
  };

  const handleScheduleInterviewSubmit = (interviewDetails) => {
    setInterviews(prev => [...prev, interviewDetails]);
    handleMoveCandidate(interviewDetails.candidateId, 'next');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-3 md:space-y-0">
        <h2 className="text-lg font-semibold text-gray-800">Candidate Pipeline</h2>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search candidates..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
            >
              <option value="all">All Positions</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="analyst">Analyst</option>
            </select>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
            </select>
            <button className="flex items-center space-x-1 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
              <FiFilter />
              <span>More Filters</span>
            </button>
            <button 
              onClick={handleAddNewCandidate}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
            >
              <FiPlus />
              <span>Add Candidate</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {pipelineStages.map((stage) => (
          <div key={stage.name} className="border rounded-lg overflow-hidden">
            <div className={`bg-${stage.color}-50 p-4 border-b flex justify-between items-center`}>
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-gray-800">{stage.name}</h3>
                <span className={`bg-${stage.color}-100 text-${stage.color}-800 text-xs px-2 py-1 rounded-full`}>
                  {stage.candidates.length} candidates
                </span>
              </div>
              {stage.candidates.length > 0 && (
                <button 
                  className="text-blue-600 text-sm hover:underline"
                  onClick={() => {
                    setSelectedStatus(stage.name.toLowerCase().replace(' ', '-'));
                  }}
                >
                  View all
                </button>
              )}
            </div>
            <div className="bg-white p-4">
              {stage.candidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stage.candidates.map(candidate => (
                    <CandidateCard 
                      key={candidate.id} 
                      candidate={candidate}
                      onMoveCandidate={handleMoveCandidate}
                      onViewProfile={handleViewProfile}
                      onScheduleInterview={handleScheduleInterview}
                      interviews={interviews}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No candidates in this stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showProfileModal && (
        <CandidateProfileModal 
          candidate={selectedCandidate} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}

      {showScheduleModal && (
        <ScheduleInterviewModal 
          candidate={selectedCandidate}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleInterviewSubmit}
        />
      )}

      {showAddCandidateModal && (
        <AddCandidateModal 
          onClose={() => setShowAddCandidateModal(false)}
          onAdd={handleAddCandidate}
        />
      )}
    </div>
  );
};

export default Pipeline;