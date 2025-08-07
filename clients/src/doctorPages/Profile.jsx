import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      <div style={{ marginTop: '20px' }}>
        <p><strong>Photo:</strong></p>
        <img
          src={`${import.meta.env.VITE_API_URL}/${profile.photoPath}`}
          alt="Therapist"
          style={{ width: '200px', border: '1px solid #ccc', borderRadius: '8px' }}
        />

        <p style={{ marginTop: '10px' }}><strong>Certificate:</strong></p>
        <img
          src={`${import.meta.env.VITE_API_URL}/${profile.degreePath}`}
          alt="Certificate"
          style={{ width: '200px', border: '1px solid #ccc', borderRadius: '8px' }}
        />
      </div>
    </div>
  );
};

export default TherapistProfile;
