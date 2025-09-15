import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pending-therapists`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTherapists(res.data);
    } catch (error) {
      console.error("Failed to fetch therapists:", error);
    }
  };

  const updateApprovalStatus = async (id, status) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/update-approval/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedTherapist(null);
      fetchTherapists();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const handleApprove = (id) => updateApprovalStatus(id, true);
  const handleDisapprove = (id) => updateApprovalStatus(id, false);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this therapist?"))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/delete-therapist/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedTherapist(null);
      fetchTherapists();
    } catch (error) {
      console.error("Failed to delete therapist:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Dashboard
      </h1>

      {/* Top Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-md"
          onClick={() => navigate("/admin/audit-logs")}
        >
          User Audit Logs
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-md"
          onClick={() => navigate("/admin/doc-audit-logs")}
        >
          Therapist Audit Logs
        </button>

         <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-md"
          onClick={() => navigate("/admin/get-payments")}
        >
          Payment List
        </button>

        {/* New Medicine Button */}
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-md"
          onClick={() => navigate("/admin/get-medicine")}
        >
          📦 Medicines
        </button>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 shadow-md"
          onClick={() => {
            localStorage.removeItem("adminToken");
            toast.success("Successfully Logout", { autoClose: 2000 });
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      {/* Therapist Details or Table */}
      {selectedTherapist ? (
        <div className="border p-6 rounded-xl shadow-md bg-white max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">
            Therapist Details
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Name:</strong> {selectedTherapist.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedTherapist.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedTherapist.phone}
            </p>
            <p>
              <strong>Specialization:</strong>{" "}
              {selectedTherapist.specialization}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedTherapist.isApproved === true
                ? "✅ Approved"
                : selectedTherapist.isApproved === false
                ? "❌ Disapproved"
                : "⏳ Pending"}
            </p>
            <p>
              <strong>DOB:</strong> {selectedTherapist.dob}
            </p>
            <p>
              <strong>Nationality:</strong> {selectedTherapist.nationality}
            </p>
            <p>
              <strong>Occupation:</strong> {selectedTherapist.occupation}
            </p>
            <p>
              <strong>Experience:</strong> {selectedTherapist.experience}
            </p>
            <p>
              <strong>Address:</strong> {selectedTherapist.address}
            </p>
            <p>
              <strong>License Number:</strong>{" "}
              {selectedTherapist.licenseNumber}
            </p>
          </div>

          {/* Photo */}
          <div className="flex justify-center mt-4">
            <img
              src={selectedTherapist.photoPath}
              alt="therapist"
              className="w-40 h-48 object-cover border rounded shadow"
            />
          </div>

          {/* Degree */}
          <p className="mt-3">
            <strong>Degree:</strong>{" "}
            <a
              href={selectedTherapist.degreePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View
            </a>
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {selectedTherapist.isApproved !== true && (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
              className="text-red-600 underline"
              onClick={() => handleDelete(selectedTherapist._id)}
            >
              Delete
            </button>
            <button
              className="text-gray-500 underline"
              onClick={() => setSelectedTherapist(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {therapists.map((therapist) => (
                <tr
                  key={therapist._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4">{therapist.name}</td>
                  <td className="py-2 px-4">{therapist.email}</td>
                  <td className="py-2 px-4">
                    {therapist.isApproved === true
                      ? "✅ Approved"
                      : therapist.isApproved === false
                      ? "❌ Disapproved"
                      : "⏳ Pending"}
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
                  <td
                    className="py-4 px-4 text-center text-gray-500"
                    colSpan="4"
                  >
                    No therapists found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
