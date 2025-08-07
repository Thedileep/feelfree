// middleware/adminAuth.js
const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authAdmin;
