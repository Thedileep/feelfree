const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// ✅ Therapist approval mail
const sendApprovalEmail = async (to, name) => {
  const mailOptions = {
    from: `"FeelFree Admin" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Your Therapist Account Has Been Approved - FeelFree',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50;">Welcome to FeelFree, ${name}!</h2>
          <p>Your therapist account has been <strong>approved</strong> by the admin. You can now log in to your dashboard and begin helping others.</p>
          <p>We are thrilled to have you on board!</p>
          
          <p style="margin-top: 30px;">Best wishes,</p>
          <p><strong>Admin Team</strong><br/>FeelFree Mental Wellness App</p>
          
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">If you did not request this email, please ignore it.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Failed to send approval email:', error.message);
  }
};

// ✅ Doctor appointment mail
const sendDoctorBookingEmail = async (doctorEmail, doctorName, date, time, patientName) => {
  const mailOptions = {
    from: `"FeelFree App" <${process.env.MAIL_USER}>`,
    to: doctorEmail,
    subject: 'New Appointment Scheduled - FeelFree',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #2196F3;">Hello Dr. ${doctorName},</h2>
          <p>You have a new appointment scheduled on <b>${date}</b> at <b>${time}</b>.</p>
          <p><b>Patient:</b> ${patientName}</p>
          <p>Please check your dashboard for more details.</p>

          <p style="margin-top: 30px;">Regards,<br/><strong>FeelFree Team</strong></p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Failed to send appointment email:', error.message);
  }
};

module.exports = { sendApprovalEmail, sendDoctorBookingEmail };
