const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const upload = require('../middleware/upload');
const { processAudioWithWhisper, processAudioWithHinglishWhisper } = require('../utils/whisper');
const { generateSRT, generateRemotionCaptions, validateSRT } = require('../utils/srt');

const router = express.Router();

router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'No audio file uploaded'
      });
    }

    console.log(`File uploaded: ${req.file.filename}`);
    console.log(`File size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);

    const audioFilePath = req.file.path;
    const { model, language } = req.body;
    
    console.log('--------------------------------------------------');
    console.log('TRANSCRIPTION REQUEST RECEIVED');
    console.log(`MODEL SELECTED: ${model || 'default (large-v3)'}`);
    console.log(`LANGUAGE: ${language || 'auto-detect'}`);
    console.log('--------------------------------------------------');
    
    const transcription = await processAudioWithWhisper(audioFilePath, model, language);
    
    console.log('Generating SRT file...');
    const srtContent = generateSRT(transcription);
    
    const remotionCaptions = generateRemotionCaptions(transcription);
    
    const validation = validateSRT(srtContent);
    if (!validation.isValid) {
      console.warn('SRT validation warnings:', validation.errors);
    }

    // NEW: Save to DB if userId is provided
    const { userId, title } = req.body;
    let project = null;
    if (userId) {
      const prisma = require('../utils/prisma');
      project = await prisma.project.create({
        data: {
          title: title || req.file.originalname,
          videoUrl: '', // You would typically upload to S3 first
          audioUrl: req.file.filename,
          captions: remotionCaptions,
          userId: userId
        }
      });
    }
    
    await fs.remove(audioFilePath);
    console.log('Temporary file cleaned up');

    res.json({
      success: true,
      srt: srtContent,
      captions: remotionCaptions,
      filename: req.file.originalname,
      transcription: transcription,
      duration: transcription.length > 0 ? transcription[transcription.length - 1].end : 0,
      segmentCount: transcription.length,
      validation: validation,
      projectId: project?.id
    });

  } catch (error) {
    console.error('Error processing audio:', error);
    
    if (req.file && req.file.path) {
      try {
        await fs.remove(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({
      error: true,
      message: error.message || 'Failed to process audio file'
    });
  }
});

router.post('/upload-audio-hinglish', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'No audio file uploaded'
      });
    }

    console.log(`Hinglish file uploaded: ${req.file.filename}`);
    console.log(`File size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);

    const audioFilePath = req.file.path;
    
    console.log('Processing audio with Hinglish Whisper model...');
    const transcription = await processAudioWithHinglishWhisper(audioFilePath);
    
    console.log('Generating SRT file...');
    const srtContent = generateSRT(transcription);
    
    const remotionCaptions = generateRemotionCaptions(transcription);
    
    const validation = validateSRT(srtContent);
    if (!validation.isValid) {
      console.warn('SRT validation warnings:', validation.errors);
    }

    // Save to DB if userId is provided
    const { userId, title } = req.body;
    let project = null;
    if (userId) {
      const prisma = require('../utils/prisma');
      project = await prisma.project.create({
        data: {
          title: title || req.file.originalname,
          videoUrl: '', 
          audioUrl: req.file.filename,
          captions: remotionCaptions,
          userId: userId
        }
      });
    }
    
    await fs.remove(audioFilePath);
    console.log('Temporary file cleaned up');

    res.json({
      success: true,
      srt: srtContent,
      captions: remotionCaptions,
      filename: req.file.originalname,
      transcription: transcription,
      duration: transcription.length > 0 ? transcription[transcription.length - 1].end : 0,
      segmentCount: transcription.length,
      validation: validation,
      projectId: project?.id,
      model: 'Hinglish Whisper (Oriserve/Whisper-Hindi2Hinglish-Swift)',
      language: 'Hinglish (Hindi + English)'
    });

  } catch (error) {
    console.error('Error processing Hinglish audio:', error);
    
    if (req.file && req.file.path) {
      try {
        await fs.remove(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({
      error: true,
      message: error.message || 'Failed to process Hinglish audio file'
    });
  }
});

router.get('/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /api/upload-audio': 'Upload audio file for transcription (Large Whisper model)',
      'POST /api/upload-audio-hinglish': 'Upload audio file for Hinglish transcription (Specialized model)'
    }
  });
});

module.exports = router;