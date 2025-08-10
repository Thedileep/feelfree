import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin-login/`,
        formData
      );
      toast.success(res.data.message || 'Login successful!');
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('time',Date.now());
      setTimeout(() => {
       navigate('/admin-dashboard');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4 font-bold">Admin Login</h2>

      <form onSubmit={handleSubmit} className="flex flex-col w-64 gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      {/* Toast container for displaying toasts */}
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
    </div>
  );
};

export default AdminLogin;
