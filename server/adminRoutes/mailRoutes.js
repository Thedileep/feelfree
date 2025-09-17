const nodemailer = require("nodemailer");

// Create transporter (Gmail + App Password required)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // Gmail address
    pass: process.env.MAIL_PASS  // 16-character app password
  }
});

// Verify transporter at startup
transporter.verify()
  .then(() => console.log("✅ SMTP Server ready to send mail"))
  .catch(err => console.error("❌ SMTP Error:", err));

// -------------------- GENERIC FUNCTION --------------------
function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Failed to send email:", err.message);
        return reject(err);
      }
      console.log("✅ Email sent:", info.response);
      resolve(info);
    });
  });
}

// -------------------- SPECIFIC EMAILS --------------------

// Registration email (verification link)
function sendVerificationEmail(to, token) {
  const verifyURL = `${process.env.BASE_URL}/api/auth/verify/${token}`;
  return sendMail({
    from: `"FeelFree App" <${process.env.MAIL_USER}>`,
    to,
    subject: "Verify your email - FeelFree",
    html: `
      <p>Welcome! Please click the link below to verify your account:</p>
      <p><a href="${verifyURL}" target="_blank">Verify My Account</a></p>
      <p>If you didn’t create this account, please ignore this email.</p>
    `
  });
}

// Therapist approval email
function sendApprovalEmail(to, name) {
  return sendMail({
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
  });
}

// Doctor booking email
function sendDoctorBookingEmail(doctorEmail, doctorName, date, time, patientName) {
  return sendMail({
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
  });
}

module.exports = {
  sendVerificationEmail,
  sendApprovalEmail,
  sendDoctorBookingEmail
};
