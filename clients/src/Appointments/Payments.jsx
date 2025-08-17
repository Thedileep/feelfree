import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // ✅ Load Razorpay script when component mounts
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      toast.error("Failed to load Razorpay SDK");
    };
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!storedUser?._id) {
      toast.error("User not found. Please log in again.");
      navigate("/login/user");
      return;
    }

    if (!razorpayLoaded) {
      toast.error("Razorpay SDK is still loading...");
      return;
    }

    try {
      // 1️⃣ Create payment order
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/create-order`,
        { amount: 1 }
      );

      if (!data.success) {
        toast.error("Error creating payment order");
        return;
      }

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Therapy Booking",
        description: "Payment for booking",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            // ✅ Send exact keys expected by backend
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payments/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment Successful!");

              const bookingRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/bookings`,
              {
                userId: storedUser._id,
                doctorId: state.doctorId,
                date: state.date,
                time: state.time,
                status: "Confirmed",
                amount: 1
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // booking ID from backend response
            const bookingId = bookingRes.data._id || bookingRes.data.booking?._id;

            navigate(`/track-appointment/${bookingId}`);


            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error(`Error verifying payment: ${error.message}`);
          }
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(`Payment failed! ${err.message}`);
    }
  };

  if (!state) {
    return <p className="text-center mt-20">Invalid booking session.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-blue-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Payment</h2>
          <p>Therapist Name: {state.name}</p>
          <p>Date: {state.date}</p>
          <p>Time: {state.time}</p>
          <p className="mb-6 text-green-600 font-bold">Amount: ₹1</p>

          <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
          >
            Pay & Confirm
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
