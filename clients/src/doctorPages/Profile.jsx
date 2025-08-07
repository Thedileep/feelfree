import React, { useEffect, useState } from 'react';
import axios from 'axios';
 import { motion } from "framer-motion";
 
const TherapistProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/therapist/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Therapist Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>DOB:</strong> {profile.dob}</p>
      <p><strong>Nationality:</strong> {profile.nationality}</p>
      <p><strong>Occupation:</strong> {profile.occupation}</p>
      <p><strong>Experience:</strong> {profile.experience}</p>
      <p><strong>Specialization:</strong> {profile.specialization}</p>
      <p><strong>License No:</strong> {profile.licenseNumber}</p>
      <p><strong>Address:</strong> {profile.address}</p>

      {/* Display photo and certificate */}
    
      <div style={{ marginTop: '30px' }}>
        {/* Photo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '12px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            maxWidth: '240px'
          }}
        >
          <p><strong>Photo:</strong></p>
          <img
            src={profile.photoPath}
            alt="Therapist"
            style={{
              width: '200px',
              height: 'auto',
              borderRadius: '10px',
              border: '2px solid #4caf50',
            }}
          />
        </motion.div>

        {/* Certificate Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '12px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            maxWidth: '240px'
          }}
        >
          <p><strong>Certificate:</strong></p>

          {/* ✅ Check if it's a PDF */}
          {profile.degreePath?.endsWith('.pdf') ? (
            <iframe
              src={profile.degreePath}
              title="Certificate PDF"
              width="200"
              height="300"
              style={{ border: '1px solid #4caf50', borderRadius: '8px' }}
            />
          ) : (
            <img
              src={profile.degreePath}
              alt="Certificate"
              style={{
                width: '200px',
                height: 'auto',
                borderRadius: '10px',
                border: '2px solid #4caf50',
              }}
            />
          )}
        </motion.div>
      </div>

    </div>
  );
};

export default TherapistProfile;
