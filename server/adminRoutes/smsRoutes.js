const axios = require('axios');
require('dotenv').config();

const sendApprovalSMS = async (phone, message) => {
  const apiKey = process.env.WHATSAPP_API_KEY;

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
    phone
  )}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.success) {
      console.log('WhatsApp message sent successfully!');
    } else {
      console.error('Failed to send WhatsApp message:', response.data);
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
  }
};


module.exports = sendApprovalSMS;
