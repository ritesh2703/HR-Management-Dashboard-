import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaUserTie, FaCalendarAlt, FaStar } from 'react-icons/fa';

const CandidateCard = ({ candidate }) => {
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
                    <Link 
                        to={`/candidates/${candidate.id}`}
                        className="text-xs px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        View Profile
                    </Link>
                    <Link 
                        to={`/schedule-interview/${candidate.id}`}
                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Schedule
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CandidateCard;