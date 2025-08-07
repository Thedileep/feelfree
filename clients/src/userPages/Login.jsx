import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/auth/LoginForm';

const Login = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <LoginForm />
    </main>
    <Footer />
  </div>
);

export default Login;