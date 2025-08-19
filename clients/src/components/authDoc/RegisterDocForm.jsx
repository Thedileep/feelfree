import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const steps = [
  'Personal Info',
  'Professional Info',
  'Account Info'
];

const TherapistRegister = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    nationality: '',
    occupation: '',
    experience: '',
    address: '',
    specialization: '',
    licenseNumber:'',
    photo:null,
    degree:null,
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

    const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/register-therapist`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    localStorage.setItem("doctor", JSON.stringify(res.data.doctor));
    localStorage.setItem("doctoken", res.data.token);
    localStorage.setItem("doclogintime", Date.now());
    localStorage.setItem("doctorname", res.data.doctor.name);


      toast.success("Registration successful");
      setTimeout(() => navigate("/login/therapist"), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      toast.error("Error: " + msg);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-700">Register as Therapist</h2>
        <div className="flex justify-center space-x-2 mb-4">
          {steps.map((s, index) => (
            <div key={index} className={`w-4 h-4 rounded-full ${index <= step ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
          ))}
        </div>

        {step === 0 && (
          <>
            <input type="text" name="name" placeholder="Full Name" 
            value={formData.name} onChange={handleChange} required 
            className="w-full px-4 py-2 border rounded-md" />

            <input type="email" name="email" placeholder="Email" 
            value={formData.email} onChange={handleChange} required 
            className="w-full px-4 py-2 border rounded-md" />

            <input type="tel" name="phone" placeholder="Phone Number" 
            value={formData.phone} onChange={handleChange} required 
            className="w-full px-4 py-2 border rounded-md" />

            <input type="date" name="dob" value={formData.dob} onChange={handleChange}
             required className="w-full px-4 py-2 border rounded-md" />

            <input type="text" name="nationality" placeholder="Nationality" 
            value={formData.nationality} onChange={handleChange} required
             className="w-full px-4 py-2 border rounded-md" />

          </>
        )}

        {step === 1 && (
          <>
            <input type="text" name="occupation" placeholder="Occupation"
             value={formData.occupation} onChange={handleChange} required 
             className="w-full px-4 py-2 border rounded-md" />

            <input type="text" name="experience" placeholder="Years of Experience"
             value={formData.experience} onChange={handleChange} required
              className="w-full px-4 py-2 border rounded-md" />

            <input type="text" name="specialization" placeholder="Specialization"
             value={formData.specialization} onChange={handleChange} required 
             className="w-full px-4 py-2 border rounded-md" />

            <input type="text" name="licenseNumber" placeholder="License Number"
             value={formData.licenseNumber} onChange={handleChange} required 
             className="w-full px-4 py-2 border rounded-md" />

            <textarea name="address" placeholder="Address" value={formData.address}
             onChange={handleChange} required className="w-full px-4 py-2 border rounded-md"
              rows={2}></textarea>

          </>
        )}

        {step === 2 && (
          <>
          <input
          type="file"
          name="photo"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="file"
          name="degree"
          accept=".pdf"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

            <input type="password" name="password" placeholder="Password"
             value={formData.password} onChange={handleChange} required
              className="w-full px-4 py-2 border rounded-md" />

            <input type="password" name="confirmPassword" placeholder="Confirm Password"
             value={formData.confirmPassword} onChange={handleChange} required 
             className="w-full px-4 py-2 border rounded-md" />

          </>
        )}

        <div className="flex justify-between">
          {step > 0 && <button type="button" onClick={handleBack} 
          className="text-indigo-600 hover:underline">Back</button>}

          {step < steps.length - 1 ? (
            <button type="button" onClick={handleNext} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
              Next</button>

          ) : (
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
              Register</button>

          )}
        </div>
         <p className="text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link to="/login/therapist" className="text-indigo-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default TherapistRegister;