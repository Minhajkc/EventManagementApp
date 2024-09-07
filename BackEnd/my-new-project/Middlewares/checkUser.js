const jwt = require('jsonwebtoken');
const User = require('../Models/User'); // Adjust path as needed

const checkUser = async (req, res, next) => {

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    const decoded = jwt.verify(token, 'JWT_SECRET');
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'user') {
      return res.status(403).json({ message: ' Not a User' });
    }

    req.userId = user._id; // Attach user ID to request
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = checkUser;
