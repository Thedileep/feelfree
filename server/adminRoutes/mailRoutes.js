// mailer.js
const nodemailer = require("nodemailer");

// Create transporter (Gmail + App Password required)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // your gmail
    pass: process.env.MAIL_PASS  // your 16-char app password
  }
});

// Verify transporter at startup
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP Error:", err);
  } else {
    console.log("✅ SMTP Server ready to send mail");
  }
});

// =================== FUNCTIONS ===================

// Registration email (verification link)
const sendVerificationEmail = async (to, token) => {
  const verifyURL = `${process.env.BASE_URL}/api/auth/verify/${token}`;

  const mailOptions = {
    from: `"FeelFree App" <${process.env.MAIL_USER}>`,
    to,
    subject: "Verify your email - FeelFree",
    html: `
      <p>Welcome! Please click the link below to verify your account:</p>
      <p><a href="${verifyURL}" target="_blank">Verify My Account</a></p>
      <p>If you didn’t create this account, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to:", to);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error.message);
  }
};

// Therapist approval mail
const sendApprovalEmail = async (to, name) => {
  const mailOptions = {
    from: `"FeelFree Admin" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your Therapist Account Has Been Approved - FeelFree",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color:#4CAF50;">Welcome to FeelFree, ${name}!</h2>
        <p>Your therapist account has been <b>approved</b>. You can now log in to your dashboard.</p>
        <p>We are thrilled to have you on board!</p>
        <p>– The FeelFree Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Approval email sent to:", to);
  } catch (error) {
    console.error("❌ Failed to send approval email:", error.message);
  }
};

// Doctor booking mail
const sendDoctorBookingEmail = async (doctorEmail, doctorName, date, time, patientName) => {
  const mailOptions = {
    from: `"FeelFree App" <${process.env.MAIL_USER}>`,
    to: doctorEmail,
    subject: "New Appointment Scheduled - FeelFree",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color:#2196F3;">Hello Dr. ${doctorName},</h2>
        <p>You have a new appointment on <b>${date}</b> at <b>${time}</b>.</p>
        <p><b>Patient:</b> ${patientName}</p>
        <p>Please check your dashboard for more details.</p>
        <p>– The FeelFree Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Appointment email sent to doctor:", doctorEmail);
  } catch (error) {
    console.error("❌ Failed to send appointment email:", error.message);
  }
};

module.exports = {
  sendVerificationEmail,
  sendApprovalEmail,
  sendDoctorBookingEmail
};
