const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const pythonCmd = process.platform === 'win32' ? 'py' : 'python3';

/**
 * Cloud Transcription (Groq) - Turbo & Ultra
 */
async function transcribeWithGroq(audioFilePath, model = 'whisper-large-v3', language = 'auto') {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return reject(new Error('GROQ_API_KEY is missing. Add your key to .env for Cloud Turbo mode.'));
    }

    console.log(`[Groq Cloud] Processing: ${model}`);

    const curlArgs = [
      '-X', 'POST',
      'https://api.groq.com/openai/v1/audio/transcriptions',
      '-H', `Authorization: Bearer ${apiKey}`,
      '-H', 'Content-Type: multipart/form-data',
      '-F', `file=@${audioFilePath}`,
      '-F', `model=${model}`,
      '-F', 'response_format=verbose_json'
    ];

    if (language && language !== 'auto' && language !== '') {
      curlArgs.push('-F', `language=${language}`);
    }

    const curlProcess = spawn('curl', curlArgs);
    let stdout = '';
    let stderr = '';

    curlProcess.stdout.on('data', (data) => { stdout += data.toString(); });
    curlProcess.stderr.on('data', (data) => { stderr += data.toString(); });

    curlProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error('Cloud API unreachable. Check your internet connection.'));
      }

      try {
        const result = JSON.parse(stdout);
        if (!result.segments) throw new Error('Invalid cloud response.');
        
        const segments = result.segments.map(s => ({
          start: s.start,
          end: s.end,
          text: s.text.trim()
        }));
        resolve(segments);
      } catch (e) {
        reject(new Error('Failed to parse Cloud response. Ensure your API key is correct.'));
      }
    });
  });
}

/**
 * Main Entry Point - All models now run on Cloud for best reliability
 */
async function processAudioWithWhisper(audioFilePath, model = 'turbo', language = 'auto') {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is missing. Please add it to .env to enable Cloud transcription.');
  }

  // Map all selections to cloud models
  // Distil is only good for English, so it's 'ultra'
  let cloudModel = 'whisper-large-v3';
  if (model === 'ultra') {
    cloudModel = 'distil-whisper-large-v3-en';
  }

  console.log(`[Cloud Route] Routing ${model} request to Groq Cloud (${cloudModel})...`);
  return transcribeWithGroq(audioFilePath, cloudModel, language);
}

/**
 * Hinglish Transcription - Runs locally via Python
 */
async function processAudioWithHinglishWhisper(audioFilePath) {
  return new Promise((resolve, reject) => {
    console.log(`[Hinglish Route] Spawning Python process for: ${audioFilePath}`);
    
    const pythonProcess = spawn(pythonCmd, [
      path.join(__dirname, 'hinglish_whisper.py'),
      audioFilePath
    ]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => { stdout += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { stderr += data.toString(); });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script error (code ${code}):`, stderr);
        return reject(new Error('Hinglish transcription failed. Ensure Python dependencies are installed.'));
      }

      try {
        const result = JSON.parse(stdout);
        if (!result.segments) throw new Error('Invalid python response.');
        
        const segments = result.segments.map(s => ({
          start: s.start,
          end: s.end,
          text: s.text.trim()
        }));
        resolve(segments);
      } catch (e) {
        console.error('Failed to parse Python output:', stdout);
        reject(new Error('Failed to parse Hinglish transcription output.'));
      }
    });
  });
}

module.exports = {
  processAudioWithWhisper,
  transcribeWithGroq,
  processAudioWithHinglishWhisper
};