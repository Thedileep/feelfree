import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// eslint-disable-next-line

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

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/register", formData, {
        headers: { "Content-Type": "application/json" }
      });

      if (res.status === 201) {
        localStorage.setItem("userName", formData.name);
        setRegistered(true); // Trigger redirect
      }
    } catch (error) {
      alert(error?.response?.data?.error || "❌ Server error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (registered) {
      navigate('/dashboard');
    }
  }, [registered, navigate]);


  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center px-4">

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-indigo-700">Create Your Account</h2>

        <input name="name" type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded-md" 
        value={formData.name} onChange={handleChange} required />

        <input name="email" type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md"
         value={formData.email} onChange={handleChange} required />

        <input name="password" type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md"
         value={formData.password} onChange={handleChange} required />

        <input name="dob" type="date" placeholder="Date of Birth" className="w-full px-4 py-2 border rounded-md" 
        value={formData.dob} onChange={handleChange} required />

        <input name="nationality" type="text" placeholder="Nationality" className="w-full px-4 py-2 border rounded-md" 
        value={formData.nationality} onChange={handleChange} />
        
        <select name="gender" className="w-full px-4 py-2 border rounded-md" 
        value={formData.gender} onChange={handleChange} required>

          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input name="occupation" type="text" placeholder="Occupation" className="w-full px-4 py-2 border rounded-md" 
        value={formData.occupation} onChange={handleChange} />

         <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white font-semibold transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {loading && (
        <p className="text-center text-blue-600 mt-2 animate-pulse">
          ⏳ Please wait, creating your account...
        </p>
      )}

        <p className="text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
