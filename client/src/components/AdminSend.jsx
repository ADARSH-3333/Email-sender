import { useState } from 'react';
import { decryptPassword } from '../utils/encryption';

function AdminSend({ selectedEmails, messages, onPrevious }) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSend = async () => {
    if (!recipientEmail) {
      alert('Please enter recipient email');
      return;
    }

    setSending(true);
    setStatusMessage('');
    
    try {
      
      // Step 1: Wake up the backend
      setStatusMessage('⏳ Waking up server... (this may take 30-60 seconds on first request)');
      
      const healthCheck = await fetch(backendURL, {
        method: 'GET',
        signal: AbortSignal.timeout(90000) // 90 second timeout for wake-up
      });

      if (!healthCheck.ok) {
        throw new Error('Backend server is not responding');
      }

      setStatusMessage('✅ Server is awake! Sending emails...');

      // Step 2: Send emails
      const emailData = selectedEmails.map((email, index) => ({
        from: email.email,
        appPassword: decryptPassword(email.appPassword),
        to: recipientEmail,
        subject: messages[index].subject,
        body: messages[index].body
      }));
      const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout


      const response = await fetch(`${backendURL}/send-emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: emailData }),
        signal: AbortSignal.timeout(120000) // 120 second timeout for sending
      });

      if (response.ok) {
        setStatusMessage('✅ All emails sent successfully!');
        setTimeout(() => {
          alert('✅ All emails sent successfully!');
          setRecipientEmail('');
          setStatusMessage('');
        }, 1000);
      } else {
        const errorData = await response.json();
        setStatusMessage('');
        alert('Failed to send emails: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      setStatusMessage('');
      if (error.name === 'TimeoutError') {
        alert('⏱️ Request timeout. The server is taking longer than expected. Please try again.');
      } else if (error.message.includes('fetch')) {
        alert('❌ Cannot connect to backend. Please check if backend is deployed correctly.');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-claude-cream p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-claude-gray mb-2">Send Emails</h1>
          <p className="text-claude-gray mb-8">Final step: Enter recipient and send</p>
          
          <div className="bg-claude-cream p-6 rounded-xl mb-8">
            <h3 className="font-bold text-lg mb-3 text-claude-orange">📊 Campaign Summary</h3>
            <div className="space-y-2 text-gray-700">
              <p>• <strong>Sending from:</strong> {selectedEmails.length} email account(s)</p>
              <p>• <strong>Total emails to send:</strong> {selectedEmails.length}</p>
              <div className="mt-4">
                <p className="font-semibold mb-2">Sender accounts:</p>
                <ul className="ml-4 space-y-1">
                  {selectedEmails.map((email, index) => (
                    <li key={email.id} className="text-sm text-claude-gray">
                      {index + 1}. {email.email}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <p className="text-blue-700 font-semibold">{statusMessage}</p>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recipient Email Address
            </label>
            <input 
              type="email"
              placeholder="recipient@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full p-4 border-2 border-claude-gray rounded-lg focus:border-claude-orange focus:outline-none transition-colors"
            />
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
            <p className="text-sm text-yellow-800">
              ℹ️ <strong>Note:</strong> First request may take 30-60 seconds as the server wakes up from sleep (free tier limitation).
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={onPrevious}
              disabled={sending}
              className="flex-1 bg-claude-gray text-white py-4 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-lg disabled:opacity-50"
            >
              ← Previous: Edit Messages
            </button>
            <button 
              onClick={handleSend}
              disabled={sending}
              className="flex-1 bg-claude-orange text-white py-4 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-lg hover:shadow-xl disabled:bg-claude-gray disabled:cursor-not-allowed"
            >
              {sending ? '📤 Sending... Please wait' : '🚀 Send All Emails'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSend;