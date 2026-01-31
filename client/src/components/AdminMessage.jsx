import { useState } from 'react';

function AdminMessage({ selectedEmails, onNext, onPrevious }) {
  const [messages, setMessages] = useState(
    selectedEmails.map(() => ({ subject: '', body: '' }))
  );
  const [sameAsFirst, setSameAsFirst] = useState(
    selectedEmails.map((_, i) => i === 0 ? false : false)
  );

  const handleMessageChange = (index, field, value) => {
    const newMessages = [...messages];
    newMessages[index][field] = value;
    setMessages(newMessages);
  };

  const handleCheckbox = (index) => {
    const newSameAsFirst = [...sameAsFirst];
    newSameAsFirst[index] = !newSameAsFirst[index];
    setSameAsFirst(newSameAsFirst);

    if (newSameAsFirst[index]) {
      const newMessages = [...messages];
      newMessages[index] = { ...messages[0] };
      setMessages(newMessages);
    }
  };

  const handleNext = () => {
    for (let i = 0; i < messages.length; i++) {
      if (!messages[i].subject || !messages[i].body) {
        alert(`Please fill message for ${selectedEmails[i].email}`);
        return;
      }
    }
    onNext(messages);
  };

  return (
    <div className="min-h-screen bg-claude-cream p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-claude-gray mb-2">Compose Messages</h1>
          <p className="text-claude-gray">Write a message for each email account</p>
        </div>
        
        <div className="space-y-6 mb-6">
          {selectedEmails.map((email, index) => (
            <div key={email.id} className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-claude-orange">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-claude-orange">{email.email}</h3>
                {index > 0 && (
                  <label className="flex items-center cursor-pointer bg-claude-cream px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all">
                    <input 
                      type="checkbox"
                      checked={sameAsFirst[index]}
                      onChange={() => handleCheckbox(index)}
                      className="mr-2 w-5 h-5 accent-claude-orange"
                    />
                    <span className="text-sm font-semibold text-claude-gray">Same as first</span>
                  </label>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter email subject..."
                    value={messages[index].subject}
                    onChange={(e) => handleMessageChange(index, 'subject', e.target.value)}
                    disabled={index > 0 && sameAsFirst[index]}
                    className="w-full p-4 border-2 border-claude-gray rounded-lg focus:border-claude-orange focus:outline-none transition-colors disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message Body
                  </label>
                  <textarea 
                    placeholder="Write your message here..."
                    value={messages[index].body}
                    onChange={(e) => handleMessageChange(index, 'body', e.target.value)}
                    disabled={index > 0 && sameAsFirst[index]}
                    rows="6"
                    className="w-full p-4 border-2 border-claude-gray rounded-lg focus:border-claude-orange focus:outline-none transition-colors disabled:bg-gray-100 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={onPrevious}
            className="flex-1 bg-claude-gray text-white py-4 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-lg"
          >
            ← Previous: Select Emails
          </button>
          <button 
            onClick={handleNext}
            className="flex-1 bg-claude-orange text-white py-4 rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            Next: Send Emails →
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminMessage;