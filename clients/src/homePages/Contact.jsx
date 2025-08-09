import React from "react";
import { Mail, Phone, MapPin } from "lucide-react"; // Icons for better visuals
import Footer from "../components/Footer";

const ContactUs = () => {
  return (
    <>
      <section className="max-w-3xl mx-auto p-10 bg-white rounded-xl shadow-lg my-16 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-4xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
          Contact Us
        </h2>
        <p className="mb-8 text-center text-lg text-gray-700 dark:text-gray-300">
          We'd love to hear from you! Whether you have questions, feedback, or need support, feel free to reach out.
        </p>

        <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:justify-between md:gap-12 text-lg">
          {/* Email */}
          <div className="flex items-center space-x-4">
            <Mail className="text-indigo-600" size={28} />
            <div>
              <h3 className="font-semibold mb-1">Email</h3>
              <a
                href="mailto:dileepady2020@gmail.com"
                className="text-indigo-600 hover:underline break-all"
              >
                dileepady2020@gmail.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-4">
            <Phone className="text-indigo-600" size={28} />
            <div>
              <h3 className="font-semibold mb-1">Phone</h3>
              <a
                href="tel:+919695935588"
                className="text-indigo-600 hover:underline"
              >
                +91 96959 35588
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center space-x-4">
            <MapPin className="text-indigo-600" size={28} />
            <div>
              <h3 className="font-semibold mb-1">Address</h3>
              <p>Jaunpur, Uttar Pradesh, India</p>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-gray-600 dark:text-gray-400">
          We are committed to providing you with the best support for FeelFree. Thank you for being a part of our community!
        </p>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;
