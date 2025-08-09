import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginDocForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login-therapist`,
        form,
        { timeout: 7000 } 
      );
      localStorage.setItem("therapist", JSON.stringify(res.data.therapist));
      localStorage.setItem('token', data.token);
      toast.success('Login successful', { autoClose: 1500 });
      navigate('/therapist-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials', { autoClose: 2000 });
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
        transition={{ duration: 0.3 }} // faster animation
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">Therapist Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-lg transition duration-200 ${
            loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register/therapist" className="text-indigo-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default LoginDocForm;
