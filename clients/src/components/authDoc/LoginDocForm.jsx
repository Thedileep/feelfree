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
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg(""); 

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login-therapist`,
        form,
        { timeout: 7000 }
      );

      localStorage.setItem("doctor", JSON.stringify(res.data.doctor));
      localStorage.setItem("doctoken", res.data.token);
      localStorage.setItem("doclogintime", Date.now());
      localStorage.setItem("doctorname", res.data.doctor.name);

      navigate("/therapist-dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";

      if (msg.includes("under review")) {
        setErrorMsg(msg);
      } else {
        toast.error(msg, { autoClose: 2000 });
      }
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
        transition={{ duration: 0.3 }} 
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">Therapist Login</h2>

        {errorMsg && (
      <div className="error-banner bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md animate-pulse">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.1 19h13.8c1.2 0 1.9-1.3 1.3-2.3l-6.9-11.9c-.6-1-2-1-2.6 0l-6.9 11.9c-.6 1 .1 2.3 1.3 2.3z" />
          </svg>
          <span className="font-semibold">{errorMsg}</span>
        </div>
      </div>
    )}


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
