const express = require('express');
const prisma = require('../utils/prisma');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Get all projects for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create a new project manually
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, videoUrl, audioUrl, captions } = req.body;
    const project = await prisma.project.create({
      data: {
        title,
        videoUrl,
        audioUrl,
        captions,
        userId: req.user.userId
      }
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update a project (e.g. edit captions)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, captions } = req.body;
    
    // Ensure project belongs to user
    const existing = await prisma.project.findFirst({
      where: { id, userId: req.user.userId }
    });
    
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const project = await prisma.project.update({
      where: { id },
      data: { 
        title: title || existing.title,
        captions: captions || existing.captions
      }
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.deleteMany({
      where: { id, userId: req.user.userId }
    });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
