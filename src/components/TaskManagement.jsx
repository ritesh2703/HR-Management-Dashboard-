import React, { useState } from 'react';
import {
    FiAlertCircle,
    FiClock,
    FiCheckCircle,
    FiPlus,
    FiCalendar,
    FiSearch,
    FiGrid,
    FiList
} from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskManagement = ({ tasks, updateTaskStatus }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('kanban');

    // Filtered tasks based on search and date
    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = searchTerm
            ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              task.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              task.description.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        const matchesDate = selectedDate
            ? new Date(task.date).toDateString() === selectedDate.toDateString()
            : true;

        return matchesSearch && matchesDate;
    });

    // Task count in each category
    const countTasksByStatus = (status) =>
        filteredTasks.filter((task) => task.status === status).length;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-pink-500">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold">Task Management</h3>

                <div className="flex items-center gap-3">
                    {/* View Options */}
                    <div className="flex gap-2 border rounded-lg px-3 py-1 bg-gray-50">
                        <button
                            className={`flex items-center gap-1 text-sm ${view === 'kanban' ? 'text-blue-500 font-bold' : 'text-gray-500'}`}
                            onClick={() => setView('kanban')}
                        >
                            <FiGrid /> Kanban
                        </button>
                        <button
                            className={`flex items-center gap-1 text-sm ${view === 'list' ? 'text-blue-500 font-bold' : 'text-gray-500'}`}
                            onClick={() => setView('list')}
                        >
                            <FiList /> List View
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 pl-10 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 w-60"
                        />
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    {/* Date Picker */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1 bg-gray-50">
                        <FiCalendar className="text-gray-500" />
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd MMMM yyyy"
                            className="outline-none bg-transparent cursor-pointer text-gray-700"
                            isClearable
                        />
                    </div>
                </div>
            </div>

            {/* Task Columns */}
            {view === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* New Requests */}
                    <TaskColumn
                        title="New Requests"
                        icon={<FiAlertCircle />}
                        color="blue"
                        tasks={filteredTasks.filter((task) => task.status === 'new')}
                        taskCount={countTasksByStatus('new')}
                        updateTaskStatus={updateTaskStatus}
                        nextStatus="in-progress"
                    />

                    {/* In Progress */}
                    <TaskColumn
                        title="In Progress"
                        icon={<FiClock />}
                        color="orange"
                        tasks={filteredTasks.filter((task) => task.status === 'in-progress')}
                        taskCount={countTasksByStatus('in-progress')}
                        updateTaskStatus={updateTaskStatus}
                        nextStatus="completed"
                    />

                    {/* Completed */}
                    <TaskColumn
                        title="Completed"
                        icon={<FiCheckCircle />}
                        color="green"
                        tasks={filteredTasks.filter((task) => task.status === 'completed')}
                        taskCount={countTasksByStatus('completed')}
                        updateTaskStatus={updateTaskStatus}
                        showStrikethrough
                    />
                </div>
            ) : (
                <ListView tasks={filteredTasks} />
            )}
        </div>
    );
};

// Task Column Component
const TaskColumn = ({
    title,
    icon,
    color,
    tasks,
    taskCount,
    updateTaskStatus,
    nextStatus,
    showStrikethrough
}) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h4 className={`text-md font-semibold text-${color}-600 flex items-center`}>
                {icon} {title} ({taskCount})
            </h4>
            <button className={`text-${color}-600 hover:text-${color}-800`}>
                <FiPlus className="text-lg" />
            </button>
        </div>

        {tasks.length === 0 && (
            <div className="text-gray-400 text-sm text-center py-4">
                No tasks available
            </div>
        )}

        {tasks.map((task) => (
            <div
                key={task.id}
                className={`bg-white p-4 rounded-lg shadow-sm border-l-4 border-${color}-500`}
            >
                <p
                    className={`text-gray-700 font-semibold ${
                        showStrikethrough && 'line-through'
                    }`}
                >
                    {task.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">{task.employeeName}</p>
                <p className="text-sm text-gray-500 mt-2">{task.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                    <strong>Date:</strong> {task.date}
                </p>

                {nextStatus && (
                    <button
                        onClick={() => updateTaskStatus(task.id, nextStatus)}
                        className={`mt-2 text-sm text-${color}-500 hover:text-${color}-700`}
                    >
                        {nextStatus === 'in-progress'
                            ? 'Move to In Progress'
                            : 'Mark as Completed'}
                    </button>
                )}
            </div>
        ))}
    </div>
);

// List View Component
const ListView = ({ tasks }) => (
    <div className="bg-gray-50 rounded-lg shadow-sm p-4">
        {tasks.length === 0 ? (
            <p className="text-center text-gray-400">No tasks available</p>
        ) : (
            <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                    <li key={task.id} className="py-4">
                        <p className="font-semibold text-gray-700">{task.title}</p>
                        <p className="text-sm text-gray-500">{task.employeeName}</p>
                        <p className="text-sm text-gray-500">{task.description}</p>
                        <p className="text-sm text-gray-500">
                            <strong>Date:</strong> {task.date}
                        </p>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

export default TaskManagement;