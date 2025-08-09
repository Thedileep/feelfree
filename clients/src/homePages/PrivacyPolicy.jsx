import React from "react";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <section className="max-w-4xl mx-auto p-10 bg-white rounded-xl shadow-lg my-16 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-4xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
          Privacy Policy
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          <p>
            At FeelFree, your privacy is very important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            1. Information We Collect
          </h3>
          <p>
            We collect information you provide directly such as your name, email, and other details when you register or interact with our services. We also collect usage data automatically to improve your experience.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            2. How We Use Your Information
          </h3>
          <p>
            Your information is used to provide, maintain, and improve our services, communicate with you, and ensure your account security.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            3. Data Security
          </h3>
          <p>
            We use industry-standard security measures to protect your data from unauthorized access or disclosure. However, no method of transmission over the internet is 100% secure.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            4. Sharing of Information
          </h3>
          <p>
            We do not sell or rent your personal data. We may share information with trusted third parties who help us operate our services, but only under strict confidentiality agreements.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            5. Your Choices
          </h3>
          <p>
            You can update or delete your personal information by contacting us. You can also control certain data collection through your device settings.
          </p>


          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            6. Changes to this Policy
          </h3>
          <p>
            We may update this Privacy Policy from time to time. Continued use of the platform after updates means you accept the changes.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            Contact Us
          </h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:dileepady2020@gmail.com" className="text-indigo-600 hover:underline">dileepady2020@gmail.com</a>.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
