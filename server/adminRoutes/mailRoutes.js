const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

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
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Failed to send email:', error.response?.data || error.message);
  }
};

module.exports = sendApprovalEmail;
