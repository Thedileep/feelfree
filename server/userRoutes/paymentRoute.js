const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Create Order
router.post("/create-order", async (req, res) => {
  try {
    if (!req.body.amount || isNaN(req.body.amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // in paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

// Verify Payment
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ success: true, message: "Payment verified successfully" });

    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });

    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

module.exports = router;
