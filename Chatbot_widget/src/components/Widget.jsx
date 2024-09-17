import React, { useState } from 'react';
import { MessageSquare, X, Menu, Mic, Send } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setShowChat(false);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      // Show chat UI
      setShowChat(true);
  
      // Add the user's query to the chat history immediately
      setChatHistory(prevHistory => {
        const updatedHistory = [
          ...prevHistory,
          { type: 'query', text: inputText }
        ];
        
        // Generate the AI response
        generateResponse(updatedHistory);
  
        // Return the updated chat history for the state
        return updatedHistory;
      });
  
      // Clear the input field
      setInputText('');
    }
  };
  
  const generateResponse = (updatedHistory) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: inputText,
        college_name: selectedCollege,
        lang: selectedLanguage,
      }),
    };
  
    fetch("http://localhost:8000/ask_query", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setChatHistory([
          ...updatedHistory,
          { type: 'response', text: data.answer }
        ]);
      })
      .catch(() => {
        setChatHistory([
          ...updatedHistory,
          { type: 'response', text: "Oops! Something went wrong. Please try again." }
        ]);
      });
  };

  const styles = {
    widgetContainer: {
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      zIndex: 9999,
      fontFamily: 'Arial, sans-serif',
    },
    button: {
      backgroundColor: '#2563EB',
      color: 'white',
      borderRadius: '50%',
      padding: '0.75rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonHover: {
      backgroundColor: '#1D4ED8',
    },
    chatContainer: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      width: '24rem',
      height: '90vh',
      maxHeight: '800px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: '#2563EB',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    body: {
      flexGrow: 1,
      padding: '1rem',
      overflowY: 'auto',
    },
    card: {
      backgroundColor: '#F3F4F6',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      borderTop: '1px solid #E5E7EB',
      padding: '1rem',
    },
    input: {
      flex: 1,
      padding: '0.5rem',
      border: '1px solid #D1D5DB',
      borderRadius: '0.5rem 0 0 0.5rem',
    },
    select: {
      flex: 1,
      padding: '0.5rem',
      border: '1px solid #D1D5DB',
      borderRadius: '0.5rem',
      marginRight: '0.5rem',
    },
    micButton: {
      padding: '0.5rem',
      backgroundColor: '#F9FAFB',
      border: '1px solid #D1D5DB',
      borderRadius: '0 0.5rem 0.5rem 0',
      cursor: 'pointer',
    },
    sendButton: {
      padding: '0.5rem',
      backgroundColor: '#2563EB',
      color: 'white',
      borderRadius: '0 0.5rem 0.5rem 0',
      cursor: 'pointer',
    },
    chatBubble: {
      maxWidth: '70%',
      padding: '0.75rem',
      borderRadius: '15px',
      margin: '0.5rem 0',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      wordWrap: 'break-word',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    userBubble: {
      backgroundColor: '#2563EB', // Blue color for user messages
      alignSelf: 'flex-end',
      color: 'white', // White text color for contrast
      borderTopRightRadius: '0',
    },
    botBubble: {
      backgroundColor: '#F3F4F6', // Light gray for bot messages
      alignSelf: 'flex-start',
      color: '#333', // Dark text color for readability
      borderTopLeftRadius: '0',
    },
    chatElement: {
      backgroundColor: '#FFF',
      padding: '1rem',
      borderRadius: '0.5rem',
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #E0E0E0',
    },
  };

  return (
    <div style={styles.widgetContainer}>
      {!isOpen ? (
        <button
          onClick={toggleWidget}
          style={styles.button}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          <MessageSquare size={32} />
        </button>
      ) : (
        <div style={styles.chatContainer}>
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Menu size={20} style={{ marginRight: '0.5rem' }} />
              <span>Pragya</span>
            </div>
            <button onClick={toggleWidget} style={{ color: 'white' }}>
              <X size={20} />
            </button>
          </div>
          <div style={styles.body}>
            {!showChat ? (
              <>
                <div style={styles.card}>
                  <h2 style={{ marginBottom: '0.5rem' }}>Predict your College</h2>
                  <input
                    type="text"
                    placeholder="Enter Your Score..."
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', marginBottom: '0.5rem' }}
                  />
                  <div style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '0.5rem', maxHeight: '6rem', overflowY: 'auto' }}>
                    <p style={{ fontWeight: 'bold' }}>Top Colleges</p>
                    <ul style={{ paddingLeft: '1rem' }}>
                      <li>College A</li>
                      <li>College B</li>
                      <li>College C</li>
                    </ul>
                  </div>
                </div>
                <div style={styles.card}>
                  <h2 style={{ marginBottom: '0.5rem' }}>Top News For You</h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <button>&lt;</button>
                    <button>&gt;</button>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '0.5rem', maxHeight: '6rem', overflowY: 'auto' }}>
                    <p style={{ fontWeight: 'bold' }}>Latest News Headline</p>
                    <p>Brief description of the news item goes here. Click to read more.</p>
                  </div>
                </div>
              </>
            ) : (
            <div id='chatElement' style={styles.chatElement}>
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.chatBubble,
                      ...(message.type === 'query' ? styles.userBubble : styles.botBubble),
                    }}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={styles.inputContainer}>
            {!showChat && (
              <div style={{ display: 'flex', marginBottom: '1rem' }}>
                <select style={styles.select}
                 value={selectedCollege}
                 onChange={(e) => setSelectedCollege(e.target.value)}>
                  <option>Select College</option>
                  <option value="A">College A</option>
                  <option value="B">College B</option >
                  <option value="C">College C</option >
                </select>
                <select style={styles.select}
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option >Select Language</option >
                  <option value="English">English</option >
                  <option value="Hindi">Hindi</option >
                </select>
              </div>
            )}
          </div>
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text..."
              style={styles.input}
            />
            <button style={styles.micButton}>
              <Mic size={20} />
            </button>
            <button style={styles.sendButton} onClick={handleSend}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
