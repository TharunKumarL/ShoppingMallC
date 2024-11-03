const jwt = require('jsonwebtoken');

// Example middleware function
const authenticateToken = (req, res, next) => {
    const token = req.headers['Authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401); // No token provided
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Invalid token
      req.user = user; // Attach user info to request
      next();
    });
  };

module.exports = authenticateToken;



  