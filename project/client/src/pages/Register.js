import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <RegisterForm />
    </main>
    <Footer />
  </div>
);

export default Register;
