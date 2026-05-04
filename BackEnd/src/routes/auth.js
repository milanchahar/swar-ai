const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
var authenticateToken = require('../middleware/auth');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'swarai_secret_key_2024';

// signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatarStyle: 'beam'
      }
    });

    const token = jwt.sign({ userId: user.id, tokenVersion: user.tokenVersion || 0 }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatarStyle: user.avatarStyle } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`[AUTH] Login failed: User ${email} not found in the local database.`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, tokenVersion: user.tokenVersion || 0 }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatarStyle: user.avatarStyle } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarStyle: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Change Password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedNewPassword,
        tokenVersion: { increment: 1 } // Invalidate other sessions
      }
    });

    // Generate NEW token for the CURRENT session so it's not logged out
    const token = jwt.sign({ userId: updatedUser.id, tokenVersion: updatedUser.tokenVersion }, JWT_SECRET);

    res.json({ message: 'Password changed successfully', token });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Update Profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatarStyle } = req.body;
    const userId = req.user.userId;

    const data = {};
    if (name) data.name = name;
    if (avatarStyle) data.avatarStyle = avatarStyle;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data
    });

    res.json({ 
      user: { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        name: updatedUser.name,
        avatarStyle: updatedUser.avatarStyle
      } 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete Account Permanently
router.delete('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // First delete any relations (like projects) if they don't CASCADE
    // In this case, we'll assume cascading is handled or we delete them here
    // await prisma.project.deleteMany({ where: { userId } });
    
    await prisma.user.delete({
      where: { id: userId }
    });
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
