import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { encryptPassword } from '../utils/encryption';

function UserDashboard({ user, onLogout }) {
  const [email, setEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');

  const handleSubmit = async () => {
    if (!email || !appPassword) {
      alert('Please fill both fields');
      return;
    }

    if (appPassword.length !== 16) {
      alert('App Password must be exactly 16 characters');
      return;
    }

    try {
      const encryptedPassword = encryptPassword(appPassword);

      await addDoc(collection(db, 'emailCredentials'), {
        email: email,
        appPassword: encryptedPassword,
        userId: user.uid,
        createdAt: new Date()
      });
      
      alert('Email and code saved successfully!');
      setEmail('');
      setAppPassword('');
    } catch (error) {
      alert('Error saving: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-claude-cream p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-claude-orange">User Dashboard</h2>
              <p className="text-claude-gray mt-1">{user.email}</p>
            </div>
            <button 
              onClick={onLogout}
              className="px-6 py-2 bg-claude-gray text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-claude-orange mb-6">Add Email Credentials</h1>
          
          {/* Instructions */}
          <div className="bg-claude-cream p-6 rounded-xl mb-6 border-l-4 border-claude-orange">
            <h3 className="font-bold text-lg mb-3 text-claude-orange">📧 How to get your App Password:</h3>
            <ol className="list-decimal ml-5 space-y-2 text-gray-700">
              <li>Go to <a href="https://myaccount.google.com/security" target="_blank" className="text-claude-orange hover:underline">Google Account Security</a></li>
              <li>Click <strong>2-Step Verification</strong> (enable if not already)</li>
              <li>Scroll to <strong>App passwords</strong> or go to <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-claude-orange hover:underline">App passwords</a></li>
              <li>Select <strong>Mail</strong> and <strong>Other (Custom name)</strong></li> passwords
              <li>Copy the 16-character code (remove spaces)</li>
            </ol>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              type="email"
              placeholder="your.email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-claude-gray rounded-lg focus:border-claude-orange focus:outline-none transition-colors"
            />
          </div>

          {/* App Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              16-Character App Password
            </label>
            <input 
              type="password"
              placeholder="xxxxxxxxxxxxxxxx"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              maxLength="16"
              className="w-full p-4 border-2 border-claude-gray rounded-lg focus:border-claude-orange focus:outline-none transition-colors font-mono"
            />
            <p className="text-sm text-claude-gray mt-2">
              {appPassword.length}/16 characters
            </p>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleSubmit}
            className="w-full bg-claude-orange text-white py-4 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;