import React from "react";
import Footer from "../components/Footer";

const TermsConditions = () => {
  return (
    <>
      <section className="max-w-4xl mx-auto p-10 bg-white rounded-xl shadow-lg my-16 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-4xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
          Terms & Conditions
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          <p>
            Welcome to FeelFree. By accessing or using our platform, you agree to comply with and be bound by these Terms & Conditions. Please read them carefully.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            1. Use of the Platform
          </h3>
          <p>
            FeelFree provides mental health and wellness tools including mood tracking, journaling, AI chat, and therapist consultations. You agree to use the platform responsibly and not for any unlawful purposes.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            2. User Accounts
          </h3>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to notify us of any unauthorized use of your account.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            3. Payments and Charges
          </h3>
          <p>
            The platform is free to use except for therapist or doctor consultations, which are charged based on the individual professional’s fees. Payments are processed securely through Razorpay.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            4. Privacy and Data Protection
          </h3>
          <p>
            We respect your privacy. Please review our Privacy Policy to understand how we collect, use, and protect your personal data.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            5. Limitation of Liability
          </h3>
          <p>
            FeelFree does not provide medical advice or diagnosis. Use the platform as a supportive tool only. We are not liable for any damages arising from your use of the service.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            6. Changes to Terms
          </h3>
          <p>
            We may update these terms occasionally. Continued use of the platform after changes constitutes your acceptance of the new terms.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            Contact Us
          </h3>
          <p>
            If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:dileepady2020@gmail.com" className="text-indigo-600 hover:underline">dileepady2020@gmail.com</a>.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default TermsConditions;
