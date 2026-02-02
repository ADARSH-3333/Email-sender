const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Gmail API setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Backend running with Gmail API!',
    timestamp: new Date().toISOString()
  });
});

// Get OAuth URL for user to authorize
app.get('/auth/url', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send'],
    prompt: 'consent'
  });
  
  res.json({ url: authUrl });
});

// Exchange authorization code for tokens
app.post('/auth/callback', async (req, res) => {
  const { code } = req.body;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Return the refresh token to store in Firebase
    res.json({ 
      success: true,
      refreshToken: tokens.refresh_token,
      email: 'Will be set by frontend'
    });
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Send emails using Gmail API
app.post('/send-emails', async (req, res) => {
  console.log('========================================');
  console.log('📧 Send emails request received');
  
  const { emails } = req.body;

  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid request' 
    });
  }

  console.log(`📊 Total emails: ${emails.length}`);

  try {
    for (let i = 0; i < emails.length; i++) {
      const emailData = emails[i];
      console.log(`\n--- Email ${i + 1}/${emails.length} ---`);
      console.log(`From: ${emailData.from}`);
      console.log(`To: ${emailData.to}`);
      console.log(`Subject: ${emailData.subject}`);

      // Set credentials for this specific user
      oauth2Client.setCredentials({
        refresh_token: emailData.refreshToken
      });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      // Create email in RFC 2822 format
      const email = [
        `From: ${emailData.from}`,
        `To: ${emailData.to}`,
        `Subject: ${emailData.subject}`,
        '',
        emailData.body
      ].join('\n');

      // Encode email in base64
      const encodedEmail = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send via Gmail API
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail
        }
      });

      console.log(`✅ Email sent! ID: ${result.data.id}`);
    }

    console.log('\n🎉 All emails sent!');
    console.log('========================================\n');
    res.json({ success: true, message: 'All emails sent successfully' });

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('========================================\n');
    
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});