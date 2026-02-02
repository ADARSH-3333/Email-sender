import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function UserDashboard({ user, onLogout }) {
  const [authorizing, setAuthorizing] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState(null);

  useEffect(() => {
    checkIfConnected();
  }, []);

  const checkIfConnected = async () => {
    try {
      const q = query(
        collection(db, 'emailCredentials'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setConnectedEmail(data.email);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleConnectGmail = async () => {
    setAuthorizing(true);
    
    try {
      const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      
      // Get OAuth URL from backend
      const response = await fetch(`${backendURL}/auth/url`);
      const data = await response.json();
      
      // Open Google OAuth in popup
      const popup = window.open(
        data.url,
        'Google OAuth',
        'width=500,height=600'
      );

      // Listen for OAuth callback
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'OAUTH_SUCCESS') {
          popup.close();
          
          const { code } = event.data;
          
          // Exchange code for tokens
          const tokenResponse = await fetch(`${backendURL}/auth/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });
          
          const tokenData = await tokenResponse.json();
          
          if (tokenData.success) {
            // Save to Firebase
            await addDoc(collection(db, 'emailCredentials'), {
              email: user.email, // Using logged-in user's email
              refreshToken: tokenData.refreshToken,
              userId: user.uid,
              createdAt: new Date()
            });
            
            alert('✅ Gmail connected successfully!');
            setConnectedEmail(user.email);
          }
        }
      });
      
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setAuthorizing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Disconnect Gmail? Admin won\'t be able to send emails from your account.')) {
      return;
    }

    try {
      const q = query(
        collection(db, 'emailCredentials'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        await deleteDoc(snapshot.docs[0].ref);
        setConnectedEmail(null);
        alert('✅ Gmail disconnected');
      }
    } catch (error) {
      alert('Error: ' + error.message);
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

        {/* Main Content */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-claude-orange mb-6">
            Connect Your Gmail
          </h1>
          
          {/* Instructions */}
          <div className="bg-claude-cream p-6 rounded-xl mb-6 border-l-4 border-claude-orange">
            <h3 className="font-bold text-lg mb-3 text-claude-orange">
              🔐 Secure Gmail Authorization
            </h3>
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
              <li>Click "Connect Gmail" below</li>
              <li>Google will ask you to authorize this app</li>
              <li>Click "Allow" to let the admin send emails from your account</li>
              <li>Your credentials are encrypted and secure</li>
              <li><strong>No passwords needed!</strong> Google handles everything</li>
            </ul>
          </div>

          {/* Connection Status */}
          {connectedEmail ? (
            <div className="bg-green-50 border-2 border-green-500 p-6 rounded-xl mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">✅</span>
                  <div>
                    <h3 className="font-bold text-green-800 text-lg">
                      Gmail Connected
                    </h3>
                    <p className="text-green-700 mt-1">{connectedEmail}</p>
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleConnectGmail}
              disabled={authorizing}
              className="w-full bg-claude-orange text-white py-4 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-lg hover:shadow-xl disabled:bg-claude-gray disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {authorizing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Connect Gmail
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;