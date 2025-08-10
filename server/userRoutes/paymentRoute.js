const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log('Received signature:', razorpay_signature);
//console.log('Expected signature:', expectedSignature);
console.log('Order ID:', razorpay_order_id);
console.log('Payment ID:', razorpay_payment_id);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

      console.log('Expected signature:', expectedSignature);

    if (expectedSignature.toLowerCase().trim() === razorpay_signature.toLowerCase().trim()) {
  return res.status(200).json({ success: true, message: "Payment verified" });
} else {
  return res.status(400).json({ success: false, message: "Invalid signature" });
}



  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;
