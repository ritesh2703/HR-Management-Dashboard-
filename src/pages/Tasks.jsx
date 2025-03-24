import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiSearch, FiFilter, FiList, FiGrid, FiColumns, 
  FiCalendar, FiEdit2, FiTrash2, FiCheck, FiClock, FiX 
} from 'react-icons/fi';
import Sidebar from '../components/Sidebar';

const Tasks = () => {
  const [userData, setUserData] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Task-related states
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'New Requests',
    priority: 'Medium',
    dueDate: '',
    assignee: ''
  });
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Fetch user data and sample tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch user data
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        // In a real app, you would fetch tasks from Firestore here
        // For now, we'll use sample data
        const sampleTasks = [
          { 
            id: 1, 
            title: 'Complete HR report', 
            description: 'Prepare monthly HR performance report', 
            status: 'New Requests', 
            priority: 'High', 
            dueDate: '2025-03-15', 
            assignee: 'John Doe' 
          },
          { 
            id: 2, 
            title: 'Process employee payroll', 
            description: 'Calculate and distribute salaries for all employees', 
            status: 'In Progress', 
            priority: 'Critical', 
            dueDate: '2025-03-05', 
            assignee: 'Sarah Johnson' 
          },
          { 
            id: 3, 
            title: 'Onboard new hires', 
            description: 'Complete paperwork and orientation for new employees', 
            status: 'New Requests', 
            priority: 'Medium', 
            dueDate: '2025-03-08', 
            assignee: 'Michael Chen' 
          },
          { 
            id: 4, 
            title: 'Update employee handbook', 
            description: 'Revise policies for remote work arrangements', 
            status: 'New Requests', 
            priority: 'Medium', 
            dueDate: '2025-03-20', 
            assignee: 'Lisa Rodriguez' 
          },
          { 
            id: 5, 
            title: 'Schedule performance reviews', 
            description: 'Coordinate manager-employee evaluation meetings', 
            status: 'In Progress', 
            priority: 'High', 
            dueDate: '2025-03-10', 
            assignee: 'David Kim' 
          },
          { 
            id: 6, 
            title: 'Renew health insurance', 
            description: 'Finalize benefits package with provider', 
            status: 'Completed', 
            priority: 'Critical', 
            dueDate: '2025-03-01', 
            assignee: 'Emily Wilson' 
          },
          { 
            id: 7, 
            title: 'Plan team building event', 
            description: 'Organize quarterly offsite activity', 
            status: 'New Requests', 
            priority: 'Low', 
            dueDate: '2025-03-25', 
            assignee: 'Robert Taylor' 
          },
          { 
            id: 8, 
            title: 'Audit training records', 
            description: 'Verify compliance training completion', 
            status: 'In Progress', 
            priority: 'Medium', 
            dueDate: '2025-03-12', 
            assignee: 'Jessica Lee' 
          },
          { 
            id: 9, 
            title: 'Implement HR software', 
            description: 'Migrate employee data to new platform', 
            status: 'New Requests', 
            priority: 'High', 
            dueDate: '2025-03-30', 
            assignee: 'IT Department' 
          },
          { 
            id: 10, 
            title: 'Conduct exit interviews', 
            description: 'Document feedback from departing employees', 
            status: 'Completed', 
            priority: 'Medium', 
            dueDate: '2025-03-03', 
            assignee: 'Amanda Park' 
          }
        ];
        
        setTasks(sampleTasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Filter and group tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? task.dueDate === filterDate : true;
    return matchesSearch && matchesDate;
  });

  const groupedTasks = {
    'New Requests': filteredTasks.filter(task => task.status === 'New Requests'),
    'In Progress': filteredTasks.filter(task => task.status === 'In Progress'),
    'Completed': filteredTasks.filter(task => task.status === 'Completed'),
  };

  // Task CRUD operations
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const newTaskWithId = { 
      ...newTask, 
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1 
    };
    setTasks([...tasks, newTaskWithId]);
    resetTaskForm();
    setShowTaskModal(false);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const resetTaskForm = () => {
    setNewTask({
      title: '',
      description: '',
      status: 'New Requests',
      priority: 'Medium',
      dueDate: '',
      assignee: ''
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <Sidebar 
        userData={userData} 
        handleLogout={handleLogout} 
        openModal={() => setIsProfileModalOpen(true)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex flex-col h-full">
          {/* Header with controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              Task Management
              {userData?.department && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({userData.department})
                </span>
              )}
            </h2>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4">
              {/* Search bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Date filter */}
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex justify-between items-center mb-4">
            {/* View mode toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}
                title="Table View"
              >
                <FiList />
              </button>
              <button 
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-md ${viewMode === 'kanban' ? 'bg-white shadow-sm' : ''}`}
                title="Kanban View"
              >
                <FiColumns />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                title="List View"
              >
                <FiGrid />
              </button>
            </div>
            
            {/* Add task button */}
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiPlus className="mr-2" /> New Task
            </button>
          </div>
          
          {/* Task display area */}
          <div className="flex-1 overflow-auto bg-white rounded-lg shadow-sm p-4">
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(task => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{task.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${task.status === 'New Requests' ? 'bg-blue-100 text-blue-800' : 
                                task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignee}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => updateTaskStatus(task.id, 'In Progress')}
                                className="text-yellow-600 hover:text-yellow-900 disabled:text-gray-400"
                                disabled={task.status === 'In Progress'}
                                title="Start Task"
                              >
                                <FiClock />
                              </button>
                              <button 
                                onClick={() => updateTaskStatus(task.id, 'Completed')}
                                className="text-green-600 hover:text-green-900 disabled:text-gray-400"
                                disabled={task.status === 'Completed'}
                                title="Complete Task"
                              >
                                <FiCheck />
                              </button>
                              <button 
                                onClick={() => deleteTask(task.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Task"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          No tasks found. Create a new task to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {viewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(groupedTasks).map(([status, tasks]) => (
                  <div key={status} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 
                        ${status === 'New Requests' ? 'bg-blue-500' : 
                          status === 'In Progress' ? 'bg-yellow-500' : 
                          'bg-green-500'}`}></span>
                      {status} <span className="ml-1 text-gray-500">({tasks.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {tasks.length > 0 ? (
                        tasks.map(task => (
                          <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                              </div>
                              <div className="flex space-x-1">
                                <button 
                                  onClick={() => deleteTask(task.id)}
                                  className="text-gray-400 hover:text-red-500"
                                  title="Delete Task"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                              <span className={`text-xs px-2 py-1 rounded 
                                ${task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-green-100 text-green-800'}`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-gray-500">{task.dueDate}</span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">Assignee: {task.assignee}</div>
                            <div className="mt-3 flex justify-between">
                              {status !== 'New Requests' && (
                                <button 
                                  onClick={() => updateTaskStatus(task.id, 'New Requests')}
                                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                >
                                  Reset
                                </button>
                              )}
                              <div className="flex space-x-2">
                                {status !== 'In Progress' && (
                                  <button 
                                    onClick={() => updateTaskStatus(task.id, 'In Progress')}
                                    className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors"
                                  >
                                    Start
                                  </button>
                                )}
                                {status !== 'Completed' && (
                                  <button 
                                    onClick={() => updateTaskStatus(task.id, 'Completed')}
                                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                                  >
                                    Complete
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-sm text-gray-500 py-4">
                          No tasks in this status
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {viewMode === 'list' && (
              <div className="space-y-3">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded 
                            ${task.status === 'New Requests' ? 'bg-blue-100 text-blue-800' : 
                              task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {task.status}
                          </span>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Delete Task"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded 
                          ${task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Assignee: {task.assignee}</div>
                      <div className="mt-3 flex space-x-2">
                        {task.status !== 'New Requests' && (
                          <button 
                            onClick={() => updateTaskStatus(task.id, 'New Requests')}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                          >
                            Reset
                          </button>
                        )}
                        {task.status !== 'In Progress' && (
                          <button 
                            onClick={() => updateTaskStatus(task.id, 'In Progress')}
                            className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors"
                          >
                            Start
                          </button>
                        )}
                        {task.status !== 'Completed' && (
                          <button 
                            onClick={() => updateTaskStatus(task.id, 'Completed')}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500 py-8">
                    No tasks found. Create a new task to get started!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Image Modal */}
      {isProfileModalOpen && userData?.profileImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsProfileModalOpen(false)}
        >
          <div
            className="relative bg-white p-4 rounded-lg shadow-md max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setIsProfileModalOpen(false)}
            >
              <FiX size={24} />
            </button>
            <img
              src={userData.profileImage}
              alt="Enlarged Profile"
              className="max-w-[80vw] max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
      
      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Task</h3>
              <button 
                onClick={() => setShowTaskModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleAddTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={newTask.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="New Requests">New Requests</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <input
                    type="text"
                    name="assignee"
                    value={newTask.assignee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter assignee name"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;