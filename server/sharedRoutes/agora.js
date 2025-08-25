const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const router = express.Router();

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

router.get("/generateToken", (req, res) => {
  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(400).json({ error: "channelName is required" });
  }

  const uid = 0; // auto uid
  const role = RtcRole.PUBLISHER;
  const expireTime = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    currentTimestamp + expireTime
  );

  return res.json({ token, appId: APP_ID, channelName });
});

module.exports = router;
