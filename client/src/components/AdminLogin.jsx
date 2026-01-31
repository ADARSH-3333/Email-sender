import { useState } from 'react';

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'adminonly@getin.com' && password === 'adminonly123') {
      onLogin();
    } else {
      alert('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-claude-cream">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-claude-gray mb-2">Admin Portal</h1>
          <p className="text-claude-gray">Sign in to manage email campaigns</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Email
            </label>
            <input 
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-claude-gray rounded-lg focus:border-claude-gray focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full p-4 border-2 border-claude-gray rounded-lg focus:border-claude-gray focus:outline-none transition-colors"
            />
          </div>

          <button 
            onClick={handleLogin}
            className="w-full bg-claude-gray text-white py-4 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;