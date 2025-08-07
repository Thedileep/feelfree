import React from 'react';
import Footer from '../components/Footer';
import LoginDocForm from '../components/authDoc/LoginDocForm';
import NavbarDoc from '../components/Navbar/NavbarDoc';

const LoginDoc = () => (
  <div className="flex flex-col min-h-screen">
    <NavbarDoc />
    <main className="flex-grow">
      <LoginDocForm />
    </main>
    <Footer />
  </div>
);

export default LoginDoc;