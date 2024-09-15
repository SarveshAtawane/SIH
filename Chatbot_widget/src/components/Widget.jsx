import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const styles = {
  widgetContainer: {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    zIndex: 9999,
    fontFamily: 'Arial, sans-serif',
  },
  chatContainer: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    width: '20rem',
    height: '24rem',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatHeader: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatTitle: {
    fontWeight: 'bold',
    fontSize: '1.125rem',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  message: (sender) => ({
    maxWidth: '75%',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
    backgroundColor: sender === 'user' ? '#2563eb' : '#e5e7eb',
    color: sender === 'user' ? 'white' : 'black',
  }),
  inputForm: {
    padding: '1rem',
    borderTop: '1px solid #e5e7eb',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem 0 0 0.375rem',
    padding: '0.5rem',
  },
  sendButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem',
    border: 'none',
    borderRadius: '0 0.375rem 0.375rem 0',
    cursor: 'pointer',
  },
  toggleButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '9999px',
    cursor: 'pointer',
  },
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Here you would typically call your AI backend to get a response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "This is a mock AI response.", sender: 'ai' }]);
      }, 1000);
    }
  };

  return (
    <div style={styles.widgetContainer}>
      {isOpen ? (
        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <h3 style={styles.chatTitle}>AI Chat</h3>
            <button style={styles.closeButton} onClick={toggleChat}>
              <X size={24} />
            </button>
          </div>
          <div style={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div key={index} style={styles.message(message.sender)}>
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={styles.inputForm}>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                style={styles.input}
              />
              <button type="submit" style={styles.sendButton}>
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button onClick={toggleChat} style={styles.toggleButton}>
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;