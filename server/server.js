const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS - allow your frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5001', 
    'http://localhost:5173',
    'https://email-sender-app.vercel.app',
    'https://email-sender-app-git-main.vercel.app',
    /\.vercel\.app$/  // Allow all Vercel preview URLs
  ],
  credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  console.log('✅ Health check requested');
  res.json({ 
    status: 'Backend is running on Railway!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// Send emails endpoint
app.post('/send-emails', async (req, res) => {
  console.log('========================================');
  console.log('📧 Send emails request received');
  
  const { emails } = req.body;

  if (!emails || !Array.isArray(emails)) {
    console.error('❌ Invalid request: emails array missing');
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid request: emails array required' 
    });
  }

  console.log(`📊 Total emails to send: ${emails.length}`);

  try {
    for (let i = 0; i < emails.length; i++) {
      const emailData = emails[i];
      console.log(`\n--- Processing email ${i + 1}/${emails.length} ---`);
      console.log(`From: ${emailData.from}`);
      console.log(`To: ${emailData.to}`);
      console.log(`Subject: ${emailData.subject}`);
      console.log(`Password length: ${emailData.appPassword?.length || 0} chars`);

      // Validate required fields
      if (!emailData.from || !emailData.to || !emailData.subject || !emailData.body || !emailData.appPassword) {
        throw new Error('Missing required fields');
      }

      console.log('🔧 Creating Gmail transporter...');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailData.from,
          pass: emailData.appPassword
        }
      });

      console.log('🔍 Verifying Gmail connection...');
      await transporter.verify();
      console.log('✅ Gmail connection verified');

      console.log('📤 Sending email...');
      const info = await transporter.sendMail({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body
      });

      console.log(`✅ Email sent! Message ID: ${info.messageId}`);
    }

    console.log('\n🎉 All emails sent successfully!');
    console.log('========================================\n');
    res.json({ success: true, message: 'All emails sent successfully' });

  } catch (error) {
    console.error('\n❌ ERROR OCCURRED:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.log('========================================\n');
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code
    });
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`🚀 Server started successfully on Railway`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log('========================================\n');
});