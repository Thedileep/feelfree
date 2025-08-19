import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    nationality: '',
    gender: '',
    occupation: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; 
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, formData, {
        timeout: 2000,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("logintime", Date.now());
      localStorage.setItem("username", res.data.user.name);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success('User registered successfully', { autoClose: 1500 });
      navigate('/dashboard');
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (error.code === 'ECONNABORTED'
          ? 'Network slow, please try again.'
          : 'Registration failed');
      toast.error(msg, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Full Name' },
    { name: 'email', type: 'email', placeholder: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password' },
    { name: 'dob', type: 'date', placeholder: '' },
    { name: 'nationality', type: 'text', placeholder: 'Nationality' },
    { name: 'occupation', type: 'text', placeholder: 'Occupation' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-300 via-blue-100 to-purple-300 flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="backdrop-blur-md bg-white/70 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-5 border border-white/40"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 drop-shadow">
          Create Your Account
        </h2>

        {fields.map((field) => (
          <input
            key={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200 bg-white/80 placeholder-gray-500"
            value={formData[field.name]}
            onChange={handleChange}
            required={field.name !== 'nationality' && field.name !== 'occupation'}
          />
        ))}

        <select
          name="gender"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/80 text-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`w-full py-2 ${
            loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white font-semibold rounded-lg transition duration-300 shadow-md flex items-center justify-center`}
        >
          {loading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          ) : (
            'Register'
          )}
        </motion.button>

        <p className="text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link
            to="/login/user"
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default RegisterForm;
