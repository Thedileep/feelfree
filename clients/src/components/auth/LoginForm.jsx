import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submit
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        formData,
        { timeout: 8000 } 
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful', { autoClose: 1500 });
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === 'ECONNABORTED'
          ? 'Network slow, please try again.'
          : 'Invalid credentials.');
      toast.error(msg, { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-300 via-blue-100 to-purple-300 flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700">
          Welcome Back
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center`}
        >
          {loading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          ) : (
            'Login'
          )}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            to="/register/user"
            className="text-indigo-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default LoginForm;
