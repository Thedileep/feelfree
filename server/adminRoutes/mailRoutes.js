const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Registration verification mail
async function sendVerificationEmail(to, verifyURL) {
  
  const msg = {
    to,
    from: process.env.MAIL_USER, 
    subject: 'Verify your email - FeelFree',
    html: `
      <p>Welcome! Please click the link below to verify your account:</p>
      <a href="${verifyURL}" target="_blank">Verify My Account</a>
      <p>If you didn’t create this account, please ignore this email.</p>
    `,
  };
  return sgMail.send(msg);
}

// ✅ Therapist approval mail
async function sendApprovalEmail(to, name) {
  const msg = {
    to,
    from: process.env.MAIL_USER,
    subject: 'Your Therapist Account Approved - FeelFree',
    html: `
      <h2>Welcome to FeelFree, ${name}!</h2>
      <p>Your therapist account has been approved. You can now log in.</p>
    `,
  };
  return sgMail.send(msg);
}

// ✅ Appointment booking mail
async function sendDoctorBookingEmail(doctorEmail, doctorName, date, time, patientName) {
  const msg = {
    to: doctorEmail,
    from: process.env.MAIL_USER,
    subject: 'New Appointment Scheduled - FeelFree',
    html: `
      <h2>Hello Dr. ${doctorName},</h2>
      <p>You have a new appointment on <b>${date}</b> at <b>${time}</b>.</p>
      <p><b>Patient:</b> ${patientName}</p>
    `,
  };
  return sgMail.send(msg);
}

module.exports = {
  sendVerificationEmail,
  sendApprovalEmail,
  sendDoctorBookingEmail,
};
