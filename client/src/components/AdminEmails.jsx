import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function AdminEmails({ onNext, onLogout }) {
  const [allCredentials, setAllCredentials] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    const querySnapshot = await getDocs(collection(db, 'emailCredentials'));
    const creds = [];
    querySnapshot.forEach((doc) => {
      creds.push({ id: doc.id, ...doc.data() });
    });
    setAllCredentials(creds);
  };

  const handleCheckbox = (credential) => {
    const exists = selectedEmails.find(e => e.id === credential.id);
    if (exists) {
      setSelectedEmails(selectedEmails.filter(e => e.id !== credential.id));
    } else {
      setSelectedEmails([...selectedEmails, credential]);
    }
  };

  const handleDelete = async (credentialId, email) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'emailCredentials', credentialId));
      alert('Email deleted successfully!');
      // Refresh the list
      fetchCredentials();
      // Remove from selected if it was selected
      setSelectedEmails(selectedEmails.filter(e => e.id !== credentialId));
    } catch (error) {
      alert('Error deleting: ' + error.message);
    }
  };

  const handleNext = () => {
    if (selectedEmails.length === 0) {
      alert('Please select at least one email');
      return;
    }
    onNext(selectedEmails);
  };

  return (
    <div className="min-h-screen bg-claude-cream p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logout */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-claude-gray">Admin Dashboard</h1>
              <p className="text-claude-gray mt-1">Manage email campaigns</p>
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
          <h2 className="text-2xl font-bold text-claude-gray mb-2">Select Email Accounts</h2>
          <p className="text-claude-gray mb-8">Choose which accounts to send from</p>
          
          {allCredentials.length === 0 ? (
            <div className="text-center py-12 bg-claude-cream rounded-xl">
              <p className="text-claude-gray text-lg">No email accounts added yet</p>
              <p className="text-sm text-claude-gray mt-2">Users need to add their credentials first</p>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {allCredentials.map((cred) => (
                <div 
                  key={cred.id} 
                  className={`flex items-center justify-between p-5 border-2 rounded-xl transition-all ${
                    selectedEmails.some(e => e.id === cred.id)
                      ? 'border-claude-orange bg-claude-cream'
                      : 'border-claude-gray hover:border-claude-orange'
                  }`}
                >
                  <div 
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => handleCheckbox(cred)}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedEmails.some(e => e.id === cred.id)}
                      onChange={() => handleCheckbox(cred)}
                      className="mr-4 w-5 h-5 accent-claude-orange"
                    />
                    <span className="font-mono text-lg">{cred.email}</span>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(cred.id, cred.email)}
                    className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={onLogout}
              className="flex-1 bg-claude-gray text-white py-4 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-lg"
            >
              ← Back to Login
            </button>
            <button 
              onClick={handleNext}
              disabled={selectedEmails.length === 0}
              className="flex-1 bg-claude-orange text-white py-4 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-lg hover:shadow-xl disabled:bg-claude-gray disabled:cursor-not-allowed"
            >
              Next: Write Messages ({selectedEmails.length} selected) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEmails;