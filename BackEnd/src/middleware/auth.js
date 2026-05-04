const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'swarai_secret_key_2024';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    
    // Resilient DB fetch with retries (for Neon cold starts)
    let user = null;
    let retries = 3;
    while (retries > 0) {
      try {
        user = await prisma.user.findUnique({
          where: { id: verified.userId },
          select: { tokenVersion: true }
        });
        break; // Success!
      } catch (dbError) {
        retries--;
        console.warn(`[DB RETRY] Connection failed, retrying... (${retries} left)`);
        if (retries === 0) throw dbError;
        await new Promise(r => setTimeout(r, 1500)); // Wait 1.5s before retry
      }
    }

    // Security Version Check:
    // If dbVersion does not match tokenVersion, it means the session has been invalidated
    // (likely due to a password change or global logout).
    const dbVersion = user?.tokenVersion != null ? user.tokenVersion : 0;
    const tokenVersion = verified.tokenVersion != null ? verified.tokenVersion : 0;

    if (!user || dbVersion !== tokenVersion) {
      return res.status(403).json({ error: 'Session expired. Please log in again.' });
    }

    req.user = verified;
    next();
  } catch (error) {
    console.error('[AUTH ERROR] Token verify failed:', error.message);
    res.status(403).json({ error: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
