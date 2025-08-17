import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  
  
  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pending-therapists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTherapists(res.data);
    } catch (error) {
      console.error('Failed to fetch therapists:', error);
    }
  };

  const updateApprovalStatus = async (id, status) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/update-approval/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedTherapist(null);
      fetchTherapists();
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const handleApprove = (id) => updateApprovalStatus(id, true);
  const handleDisapprove = (id) => updateApprovalStatus(id, false);

  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this therapist?')) return;

  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/delete-therapist/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSelectedTherapist(null);
    fetchTherapists(); 
  } catch (error) {
    console.error('Failed to delete therapist:', error);
  }
};


  return (
    <div className="m-8 p-8">
     <h1 className="text-2xl font-bold mb-6 text-center">Therapist Approval Dashboard</h1>

      <button
      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={() => navigate("/admin/audit-logs")}
    >
      View  User Audit Logs
    </button>

       <button
      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={() => navigate("/admin/doc-audit-logs")}
    >
      View Therapist Audit Logs
    </button>
     
      <button
          variant="destructive"
          className="ml-auto flex items-center gap-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition-all"
          onClick={() => {
            localStorage.removeItem('adminToken');
            toast.success('Successfully Logout',{autoClose:2000});
            navigate('/');
          }}
        >
          Logout
        </button>
          <br></br>
          
      {selectedTherapist ? (
        <div className="border p-6 pl-6 rounded shadow-md w-full max-w-xl bg-white mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Therapist Details</h2>
          <p><strong>Name:</strong> {selectedTherapist.name}</p>
          <p><strong>Email:</strong> {selectedTherapist.email}</p>
          <p><strong>Phone:</strong> {selectedTherapist.phone}</p>
          <p><strong>Specialization:</strong> {selectedTherapist.specialization}</p>
          <p><strong>Status:</strong> {selectedTherapist.isApproved === true ? '✅ Approved' : selectedTherapist.isApproved === false ? '❌ Disapproved' : '⏳ Pending'}</p>
          <p><strong>DOB:</strong> {selectedTherapist.dob}</p>
          <p><strong>Nationality:</strong> {selectedTherapist.nationality}</p>
          <p><strong>Occupation:</strong> {selectedTherapist.occupation}</p>
          <p><strong>Experience:</strong> {selectedTherapist.experience}</p>
          <p><strong>Address:</strong> {selectedTherapist.address}</p>
          <p><strong>License Number:</strong> {selectedTherapist.licenseNumber}</p>
          <p>
            <strong>Photo:</strong>{' '}
             <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center', 
                  marginTop: '20px',    
                }}
              >
                <img
                  src={selectedTherapist.photoPath}
                  alt="therapist"
                  style={{
                    width: '200px',
                    height: '220px',
                    borderRadius: '3px',
                    border: '2px solid #090a09ff',
                  }}
                />
              </div>
          </p>
          <p>
            <strong>Degree:</strong>{' '}
            <a href={selectedTherapist.degreePath} target="_blank" rel="noopener noreferrer">
              View 
            </a>
          </p>

          <div className="mt-6 flex gap-4 ">
            {selectedTherapist.isApproved !== true && (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mx-auto"
                onClick={() => handleApprove(selectedTherapist._id)}
              >
                Approve
              </button>
            )}
            {selectedTherapist.isApproved !== false && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleDisapprove(selectedTherapist._id)}
              >
                Disapprove
              </button>
            )}

            <button
              className="text-red-600 ml-4 hover:underline"
              onClick={() => handleDelete(selectedTherapist._id)}
            >
              Delete
            </button>


            <button
              className="ml-auto text-gray-500 hover:text-black"
              onClick={() => setSelectedTherapist(null)}
            >
              Cancel
            </button>

          </div>
        </div>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {therapists.map((therapist) => (
              <tr key={therapist._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{therapist.name}</td>
                <td className="py-2 px-4">{therapist.email}</td>
                <td className="py-2 px-4">
                  {therapist.isApproved === true ? '✅ Approved' :
                   therapist.isApproved === false ? '❌ Disapproved' : '⏳ Pending'}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setSelectedTherapist(therapist)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {therapists.length === 0 && (
              <tr>
                <td className="py-4 px-4" colSpan="4">No therapists found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      
  
    </div>
  );
};

export default AdminDashboard;
