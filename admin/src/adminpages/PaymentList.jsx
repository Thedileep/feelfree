import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/all-payments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPayments(data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        toast.error("Failed to fetch payments");
      }
    };
    fetchPayments();
  }, [token]);

  const filteredPayments = payments.filter((p) => {
    const userMatch = searchUser
      ? p.userId.name.toLowerCase().includes(searchUser.toLowerCase())
      : true;
    const doctorMatch = searchDoctor
      ? p.doctorId.name.toLowerCase().includes(searchDoctor.toLowerCase())
      : true;
    return userMatch && doctorMatch;
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">
          Admin Payment Dashboard
        </h2>

        {/* Search Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <input
            type="text"
            placeholder="Search by User Name"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="border px-4 py-2 rounded-lg flex-1"
          />
          <input
            type="text"
            placeholder="Search by Doctor Name"
            value={searchDoctor}
            onChange={(e) => setSearchDoctor(e.target.value)}
            className="border px-4 py-2 rounded-lg flex-1"
          />
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Doctor</th>
                <th className="py-3 px-4 text-left">Amount (₹)</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{p.userId.name}</td>
                    <td className="py-3 px-4">{p.doctorId.name}</td>
                    <td className="py-3 px-4">{p.amount}</td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        p.status === "Paid"
                          ? "text-green-600"
                          : p.status === "Created"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {p.status}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
     
    </>
  );
};

export default PaymentsList;
