const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// IMPORTANT: Allow your Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://your-app.vercel.app'  // Add your Vercel URL here
  ],
  credentials:true
}));

app.use(express.json());

app.post('/send-emails', async (req, res) => {
  const { emails } = req.body;

  try {
    for (let emailData of emails) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailData.from,
          pass: emailData.appPassword
        }
      });

      await transporter.sendMail({
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body
      });

      console.log(`✅ Email sent from ${emailData.from}`);
    }

    res.json({ success: true, message: 'All emails sent' });
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});