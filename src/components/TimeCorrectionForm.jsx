import React, { useState } from 'react';
import { FiX, FiClock } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Timestamp } from 'firebase/firestore';

const TimeCorrectionForm = ({ onClose, onSubmit, userId }) => {
    const [date, setDate] = useState(new Date());
    const [currentCheckIn, setCurrentCheckIn] = useState('09:00');
    const [currentCheckOut, setCurrentCheckOut] = useState('17:00');
    const [requestedCheckIn, setRequestedCheckIn] = useState('09:00');
    const [requestedCheckOut, setRequestedCheckOut] = useState('17:00');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            const timeData = {
                date: Timestamp.fromDate(date),
                currentCheckIn,
                currentCheckOut,
                requestedCheckIn,
                requestedCheckOut,
                reason,
                employeeId: userId,
                status: 'pending',
                createdAt: Timestamp.now()
            };
            
            await onSubmit(timeData);
        } catch (err) {
            console.error("Submission error:", err);
            setError("Failed to submit time correction. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Request Time Correction</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>
                
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Date</label>
                        <div className="relative">
                            <DatePicker
                                selected={date}
                                onChange={(date) => setDate(date)}
                                className="w-full p-2 border rounded-lg pl-10"
                                required
                                maxDate={new Date()}
                            />
                            <FiClock className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Current Check-in</label>
                            <input
                                type="time"
                                value={currentCheckIn}
                                onChange={(e) => setCurrentCheckIn(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Current Check-out</label>
                            <input
                                type="time"
                                value={currentCheckOut}
                                onChange={(e) => setCurrentCheckOut(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Requested Check-in</label>
                            <input
                                type="time"
                                value={requestedCheckIn}
                                onChange={(e) => setRequestedCheckIn(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Requested Check-out</label>
                            <input
                                type="time"
                                value={requestedCheckOut}
                                onChange={(e) => setRequestedCheckOut(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Reason for Correction</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                            required
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded-lg text-white ${isSubmitting ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TimeCorrectionForm;