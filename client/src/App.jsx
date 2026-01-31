import { useState } from 'react';
import UserLogin from './components/UserLogin';
import UserDashboard from './components/UserDashboard';
import AdminLogin from './components/AdminLogin';
import AdminEmails from './components/AdminEmails';
import AdminMessage from './components/AdminMessage';
import AdminSend from './components/AdminSend';

function App() {
  const [mode, setMode] = useState('home');
  const [user, setUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminStep, setAdminStep] = useState(1);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [messages, setMessages] = useState([]);

  // Admin logout handler
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminStep(1);
    setSelectedEmails([]);
    setMessages([]);
    setMode('home');
  };

  if (mode === 'home') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-claude-cream">
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-6xl font-bold text-claude-orange mb-4">
            Email Sender
          </h1>
          <p className="text-xl text-claude-gray mb-12">
            Send personalized emails from multiple accounts effortlessly
          </p>
          <div className="flex gap-6 justify-center">
            <button 
              onClick={() => setMode('user')}
              className="px-8 py-4 bg-claude-orange text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              User Portal
            </button>
            <button 
              onClick={() => setMode('admin')}
              className="px-8 py-4 bg-claude-gray text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'user') {
    if (!user) {
      return <UserLogin onLogin={setUser} />;
    }
    return <UserDashboard user={user} onLogout={() => { setUser(null); setMode('home'); }} />;
  }

  if (mode === 'admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;
    }
    
    if (adminStep === 1) {
      return (
        <AdminEmails 
          onNext={(emails) => { 
            setSelectedEmails(emails); 
            setAdminStep(2); 
          }} 
          onLogout={handleAdminLogout}
        />
      );
    }
    
    if (adminStep === 2) {
      return (
        <AdminMessage 
          selectedEmails={selectedEmails} 
          onNext={(msgs) => { 
            setMessages(msgs); 
            setAdminStep(3); 
          }}
          onPrevious={() => setAdminStep(1)}
        />
      );
    }
    
    if (adminStep === 3) {
      return (
        <AdminSend 
          selectedEmails={selectedEmails} 
          messages={messages}
          onPrevious={() => setAdminStep(2)}
        />
      );
    }
  }
}

export default App;
