import React from 'react';
import Footer from '../components/Footer';
import TherapistRegister from '../components/authDoc/RegisterDocForm';
import NavbarDoc from '../components/Navbar/NavbarDoc';


const RegisterDoc = () => (
  <div className="flex flex-col min-h-screen">
    <NavbarDoc />
    <main className="flex-grow">
      <TherapistRegister/>
    </main>
    <Footer />
  </div>
);

export default RegisterDoc;
