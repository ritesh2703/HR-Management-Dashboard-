import React, { useState } from 'react';
import { FiX, FiUserPlus, FiMail, FiBriefcase, FiHome, FiCalendar, FiPhone, FiLock, FiCheckCircle } from 'react-icons/fi';
import emailjs from 'emailjs-com';

const AddEmployee = ({ onClose, onAddEmployee, existingEmployees }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    branch: 'HQ',
    reportsTo: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [emailStatus, setEmailStatus] = useState({ 
    sent: false, 
    verified: false,
    recipient: ''
  });

  const departments = ['Executive', 'Technology', 'Finance', 'HR', 'Marketing', 'Operations'];
  const branches = ['HQ', 'West', 'East', 'North', 'South'];
  const statusOptions = ['Active', 'Inactive', 'On Leave'];

  // Initialize EmailJS
  emailjs.init('nyWSCDREqTQk2sAnF');

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    return result;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const verifyEmailDelivery = async (email) => {
    try {
      // In a real app, implement actual email verification here
      // For now, we'll simulate verification with a timeout
      return new Promise(resolve => {
        setTimeout(() => {
          // Simulate 90% success rate for demo
          const isDelivered = Math.random() > 0.1;
          console.log(`Email ${isDelivered ? 'delivered' : 'failed'} to ${email}`);
          resolve(isDelivered);
        }, 1500);
      });
    } catch (error) {
      console.error('Verification failed:', error);
      return false;
    }
  };

  const sendWelcomeEmail = async (employeeData, tempPassword) => {
    const reportsToName = existingEmployees.find(e => e.id === employeeData.reportsTo)?.name || 'None';
    
    const templateParams = {
      to_name: employeeData.name,
      position: employeeData.position,
      department: employeeData.department,
      branch: employeeData.branch,
      join_date: employeeData.joinDate,
      email: employeeData.email,
      phone: employeeData.phone,
      reports_to: reportsToName,
      password: tempPassword,
      login_link: window.location.origin + '/login'
    };

    try {
      console.log('Sending email to:', employeeData.email);
      const response = await emailjs.send(
        'service_intf4ho',
        'template_sw79h2n',
        templateParams
      );
      
      console.log('Email API response:', response);
      
      if (response.status === 200) {
        setEmailStatus({ 
          sent: true, 
          verified: false,
          recipient: employeeData.email
        });
        
        // Verify email delivery
        const isDelivered = await verifyEmailDelivery(employeeData.email);
        
        setEmailStatus({ 
          sent: true, 
          verified: isDelivered,
          recipient: employeeData.email
        });
        
        return isDelivered;
      }
      return false;
    } catch (error) {
      console.error('Email sending error:', error);
      setError(`Email sending failed: ${error.text || error.message}`);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setEmailStatus({ 
      sent: false, 
      verified: false,
      recipient: ''
    });

    // Validation
    if (!formData.name || !formData.position || !formData.department || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (existingEmployees.some(emp => emp.email === formData.email)) {
      setError('An employee with this email already exists');
      setIsSubmitting(false);
      return;
    }

    if (existingEmployees.some(emp => emp.phone === formData.phone)) {
      setError('An employee with this phone number already exists');
      setIsSubmitting(false);
      return;
    }

    const tempPassword = password || generatePassword();

    try {
      const emailSuccess = await sendWelcomeEmail(formData, tempPassword);
      
      if (!emailSuccess) {
        setIsSubmitting(false);
        return;
      }

      // Add employee only after email is confirmed sent
      onAddEmployee({
        ...formData,
        id: Date.now(),
        password: tempPassword
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        branch: 'HQ',
        reportsTo: '',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
      setPassword('');

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to complete the operation: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold flex items-center">
            <FiUserPlus className="mr-2" /> Add New Employee
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {emailStatus.sent && (
            <div className={`mb-4 p-2 rounded text-sm flex items-center ${
              emailStatus.verified 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {emailStatus.verified ? (
                <>
                  <FiCheckCircle className="mr-2 text-green-500" />
                  <span>Email delivered to {emailStatus.recipient}</span>
                </>
              ) : (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <span>Sending to {emailStatus.recipient}...</span>
                </>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUserPlus className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBriefcase className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reports To</label>
                <select
                  name="reportsTo"
                  value={formData.reportsTo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">None</option>
                  {existingEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.position})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="pl-10 w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="absolute right-2 top-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This password will be included in the welcome email.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;