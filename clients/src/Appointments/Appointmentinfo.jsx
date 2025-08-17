
import React from 'react'
export default function AppointmentInfo({ booking }) {
  return (
    <>
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Appointment with {booking.doctorId?.name}
      </h1>
      <p className="mb-2">Date: {booking.date}</p>
      <p className="mb-2">Time: {booking.time}</p>
      <p className="mb-4">Status: {booking.status}</p>
    </>
  );
}
