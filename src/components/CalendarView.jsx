import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FiPlus, FiLink, FiUser, FiClock, FiCalendar, FiInfo, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

const localizer = momentLocalizer(moment);

const CalendarView = ({ interviews, onScheduleInterview, onViewInterview }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState(Views.WEEK);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const eventStyleGetter = (event) => {
        const statusColors = {
            scheduled: '#4299e1',
            completed: '#48bb78',
            canceled: '#f56565',
            screening: '#9f7aea',
            aptitude: '#ed8936',
            technical: '#667eea',
            hr: '#f687b3',
            final: '#68d391'
        };

        const backgroundColor = statusColors[event.status] || statusColors[event.interviewType] || statusColors.scheduled;
        
        const style = {
            backgroundColor,
            borderRadius: '4px',
            opacity: 0.9,
            color: 'white',
            border: '0px',
            display: 'block',
            cursor: 'pointer',
            height: '100%',
            padding: '2px',
            fontSize: '12px',
            position: 'relative',
            zIndex: tooltipVisible ? 999 : 'auto'
        };
        
        return { style };
    };

    const CustomEvent = ({ event }) => {
        return (
            <div 
                className="h-full overflow-hidden"
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                    setShowModal(true);
                }}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
                data-tooltip-id={`event-tooltip-${event.id}`}
                data-tooltip-place="top"
                data-tooltip-float={true}
            >
                <div className="font-semibold truncate">{event.title}</div>
                <div className="text-xs truncate capitalize">{event.interviewType || event.status}</div>
                <div className="text-xs">
                    {moment(event.start).format('h:mm a')} - {moment(event.end).format('h:mm a')}
                </div>
                
                <Tooltip 
                    id={`event-tooltip-${event.id}`} 
                    className="z-[1000]"
                    openOnClick={false}
                    positionStrategy="fixed"
                >
                    <div className="max-w-xs p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <h3 className="font-bold text-lg mb-2 flex items-center text-gray-800">
                            <FiInfo className="mr-2" /> Quick View
                        </h3>
                        <div className="space-y-2 text-gray-700">
                            <div className="flex items-center">
                                <FiUser className="mr-2 flex-shrink-0" />
                                <span>{event.candidateName}</span>
                            </div>
                            <div className="flex items-center">
                                <FiUser className="mr-2 flex-shrink-0" />
                                <span>{event.interviewerName}</span>
                            </div>
                            <div className="flex items-center">
                                <FiCalendar className="mr-2 flex-shrink-0" />
                                <span className="capitalize">{event.interviewType || event.status}</span>
                            </div>
                            <div className="flex items-center">
                                <FiClock className="mr-2 flex-shrink-0" />
                                <span>
                                    {moment(event.start).format('MMM Do, h:mm a')} - {moment(event.end).format('h:mm a')}
                                </span>
                            </div>
                            {event.meetingLink && (
                                <div className="flex items-center">
                                    <FiLink className="mr-2 flex-shrink-0" />
                                    <a 
                                        href={event.meetingLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Join Meeting
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </Tooltip>
            </div>
        );
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleScheduleClick = () => {
        if (onScheduleInterview) {
            onScheduleInterview();
        }
    };

    const handleSlotSelect = (slotInfo) => {
        if (onScheduleInterview) {
            onScheduleInterview({
                startTime: slotInfo.start,
                endTime: slotInfo.end
            });
        }
    };

    const handleViewDetails = () => {
        if (onViewInterview && selectedEvent) {
            onViewInterview(selectedEvent.id);
            setShowModal(false);
        }
    };

    const CustomToolbar = (toolbar) => {
        const goToBack = () => {
            toolbar.onNavigate('PREV');
            setCurrentDate(moment(currentDate).subtract(1, view === Views.MONTH ? 'month' : view === Views.WEEK ? 'week' : 'day').toDate());
        };

        const goToNext = () => {
            toolbar.onNavigate('NEXT');
            setCurrentDate(moment(currentDate).add(1, view === Views.MONTH ? 'month' : view === Views.WEEK ? 'week' : 'day').toDate());
        };

        const goToToday = () => {
            toolbar.onNavigate('TODAY');
            setCurrentDate(new Date());
        };

        const changeView = (view) => {
            toolbar.onView(view);
            setView(view);
        };

        return (
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={goToBack}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <FiChevronLeft />
                    </button>
                    <button 
                        onClick={goToToday}
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                        Today
                    </button>
                    <button 
                        onClick={goToNext}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <FiChevronRight />
                    </button>
                    <span className="text-lg font-semibold">
                        {toolbar.label}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => changeView(Views.MONTH)}
                        className={`px-4 py-2 rounded-lg ${view === Views.MONTH ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        Month
                    </button>
                    <button 
                        onClick={() => changeView(Views.WEEK)}
                        className={`px-4 py-2 rounded-lg ${view === Views.WEEK ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        Week
                    </button>
                    <button 
                        onClick={() => changeView(Views.DAY)}
                        className={`px-4 py-2 rounded-lg ${view === Views.DAY ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        Day
                    </button>
                    <button 
                        onClick={handleScheduleClick}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ml-4"
                    >
                        <FiPlus />
                        <span>Schedule</span>
                    </button>
                </div>
            </div>
        );
    };

    // Format events properly
    const formattedEvents = interviews.map(interview => ({
        ...interview,
        title: `Interview with ${interview.candidateName}`,
        start: new Date(interview.start),
        end: new Date(interview.end),
        status: interview.status || 'scheduled'
    }));

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-[700px]">
                <Calendar
                    localizer={localizer}
                    events={formattedEvents}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={handleEventClick}
                    onSelectSlot={handleSlotSelect}
                    selectable
                    view={view}
                    onView={setView}
                    views={[Views.DAY, Views.WEEK, Views.MONTH]}
                    defaultView={Views.WEEK}
                    date={currentDate}
                    onNavigate={(date) => setCurrentDate(date)}
                    components={{
                        event: CustomEvent,
                        toolbar: CustomToolbar
                    }}
                    step={30}
                    timeslots={1}
                    dayLayoutAlgorithm="no-overlap"
                    showMultiDayTimes
                    popup
                    tooltipAccessor={null}
                    eventPropGetter={eventStyleGetter}
                />
            </div>

            {/* Event Detail Modal */}
            {showModal && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">
                                Interview Details
                            </h3>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <FiUser className="mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold">Candidate</h4>
                                    <p>{selectedEvent.candidateName}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <FiUser className="mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold">Interviewer</h4>
                                    <p>{selectedEvent.interviewerName}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <FiCalendar className="mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold">Interview Type</h4>
                                    <p className="capitalize">{selectedEvent.interviewType || selectedEvent.status}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <FiClock className="mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold">Time</h4>
                                    <p>
                                        {moment(selectedEvent.start).format('dddd, MMMM Do, h:mm a')} - {' '}
                                        {moment(selectedEvent.end).format('h:mm a')}
                                    </p>
                                </div>
                            </div>
                            
                            {selectedEvent.meetingLink && (
                                <div className="flex items-start">
                                    <FiLink className="mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold">Meeting Link</h4>
                                        <a 
                                            href={selectedEvent.meetingLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            Join Meeting
                                        </a>
                                    </div>
                                </div>
                            )}
                            
                            <div className="pt-4 flex justify-end space-x-3">
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                <button 
                                    onClick={handleViewDetails}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    View Full Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;