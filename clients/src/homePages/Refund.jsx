import React from "react";
import Footer from "../components/Footer";

const CancellationRefund = () => {
  return (
    <>
      <section className="max-w-4xl mx-auto p-10 bg-white rounded-xl shadow-lg my-16 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-4xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
          Cancellation & Refund Policy
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          <p>
            At FeelFree, we aim to provide a smooth and transparent experience. Please read our cancellation and refund policies carefully.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            1. Cancellation Policy
          </h3>
          <p>
            Users may cancel appointments with therapists or doctors up to 24 hours before the scheduled session without any charges.
          </p>
          <p>
            Cancellations made less than 24 hours before the appointment may be subject to a cancellation fee as determined by the therapist.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            2. Refund Policy
          </h3>
          <p>
            Since payments are processed directly for consultations with therapists or doctors, refunds will depend on the individual therapist's policies.
          </p>
          <p>
            FeelFree does not hold or process payments for sessions, but we encourage users to communicate with the therapist directly for any refund requests.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            3. Disputes
          </h3>
          <p>
            For any disputes related to cancellations or refunds, please contact our support team at <a href="mailto:dileepady2020@gmail.com" className="text-indigo-600 hover:underline">dileepady2020@gmail.com</a> and we will assist you promptly.
          </p>

          <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            4. Changes to This Policy
          </h3>
          <p>
            We reserve the right to update or modify this policy at any time. Updated policies will be posted on our platform.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CancellationRefund;
