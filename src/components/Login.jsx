import React, { useState } from 'react';
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showResetForm, setShowResetForm] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // App.jsx will handle redirection based on role
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                setError('Invalid email or password. Please try again.');
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email to reset your password.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent successfully. Check your inbox!");
        } catch (error) {
            setError("Failed to send reset email. Please check the email entered.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Welcome Back 👋
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {!showResetForm ? (
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <div className="flex items-center border rounded-lg p-2">
                                <FiMail className="text-gray-400 mr-2" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Password</label>
                            <div className="flex items-center border rounded-lg p-2">
                                <FiLock className="text-gray-400 mr-2" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-blue-500 text-white py-3 rounded-lg transition-all duration-300 ${
                                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <p
                            className="text-center text-blue-500 mt-4 cursor-pointer hover:underline"
                            onClick={() => setShowResetForm(true)}
                        >
                            Forgot Password?
                        </p>
                    </form>
                ) : (
                    <div>
                        <p className="text-gray-600 mb-4">
                            Enter your email to receive a password reset link.
                        </p>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400"
                                required
                            />
                        </div>

                        <button
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                            onClick={handleForgotPassword}
                        >
                            Send Reset Link
                        </button>

                        <p
                            className="text-center text-gray-500 mt-4 cursor-pointer hover:underline"
                            onClick={() => setShowResetForm(false)}
                        >
                            Back to Login
                        </p>
                    </div>
                )}

                <p className="text-center text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;