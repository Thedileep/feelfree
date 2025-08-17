// src/pages/UserAuditLogs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserAuditLogs = () => {
  const [userLogs, setUserLogs] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchUserLogs();
  }, []);

  const fetchUserLogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/user-audit-logs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserLogs(res.data.data || res.data.logs || []);
    } catch (err) {
      console.error("❌ Failed to fetch user audit logs:", err);
      toast.error("Failed to fetch user audit logs");
    }
  };

  const deleteLog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this audit log?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/audit-log/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Audit log deleted successfully");
      fetchUserLogs();
    } catch (err) {
      console.error("❌ Failed to delete audit log:", err);
      toast.error("Failed to delete audit log");
    }
  };

  const renderDetails = (obj) => {
    if (!obj) return "N/A";
    return (
      <ul className="list-disc pl-4 text-xs sm:text-sm break-words">
        {Object.entries(obj).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {String(value)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center text-green-700">
        User Audit Logs
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-2 sm:p-4 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-200 text-left text-xs sm:text-sm">
            <tr>
              <th className="py-3 px-4">User Details</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Tracking Data</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {userLogs.map((log) => (
              <tr key={log._id} className="border-b hover:bg-gray-50 align-top">
                <td className="py-2 px-4">{renderDetails(log.userId)}</td>

                <td className="py-2 px-4">
                  {log.action}{" "}
                  {log.ipAddress && (
                    <a
                      href={`https://ipinfo.io/${log.ipAddress}?token=${import.meta.env.VITE_IPINFO_TOKEN}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline ml-1 break-all"
                    >
                      {log.ipAddress}
                    </a>
                  )}
                </td>

                <td className="py-2 px-4">
                  <div className="max-w-[14rem] sm:max-w-[18rem] md:max-w-[20rem] max-h-36 overflow-auto border border-gray-300 rounded-md p-2 bg-gray-50">
                    {renderDetails({
                      IP_Address: log.ipAddress,
                      Device: log.deviceInfo,
                      Location: log.location,
                    })}
                  </div>
                </td>

                <td className="py-2 px-4 text-xs sm:text-sm">
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleString()
                    : "N/A"}
                </td>

                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 text-white px-3 py-1 text-xs sm:text-sm rounded hover:bg-red-600"
                    onClick={() => deleteLog(log._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {userLogs.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-sm">
                  No user audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAuditLogs;
