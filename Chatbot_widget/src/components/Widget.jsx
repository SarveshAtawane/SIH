import React, { useState } from 'react';
import { MessageSquare, X, Menu, Mic, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import collegeList from './collegelist';
import newsItems from './News';
const ReactMarkdown = React.lazy(() => import('react-markdown'));

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [inputText, setInputText] = useState('');
  const [score, setScore] = useState('');
  const [predictedColleges, setPredictedColleges] = useState([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setShowChat(false);
  };

  const predictColleges = () => {
    const scoreNum = parseFloat(score);
    if (!isNaN(scoreNum)) {
      const predicted = collegeList
        .filter(college => college.minScore <= scoreNum)
        .sort((a, b) => b.minScore - a.minScore)
        .slice(0, 3);
      setPredictedColleges(predicted);
    }
  };

  const nextNews = () => {
    setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex((prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length);
  };

  const handleScoreChange = (e) => {
    setScore(e.target.value);
  };

  const handleCollegeChange = (e) => {
    setSelectedCollege(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      predictColleges();
    }
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

  const keypress2 = (e) => {
    if(e.key === 'Enter'){
      handleSend();
    }
  }

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
  console.log(requestOptions)
    fetch("http://localhost:8000/ask_query", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setChatHistory([
          ...updatedHistory,
          { type: 'response', text: data.answer,isMarkdown:true }
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
    newsCardStyles: {
      backgroundColor: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      height: '150px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    newsButtonStyles: {
      backgroundColor: '#2563EB',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    predictorCard: {
      backgroundColor: '#0066CC',
      borderRadius: '0.5rem',
      padding: '1rem',
      display: 'flex',
      color: 'white',
    },
    predictorLeft: {
      flex: 1,
      marginRight: '1rem',
    },
    predictorRight: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      color: '#333',
    },
    predictorInput: {
      width: '100%',
      padding: '0.5rem',
      border: 'none',
      borderRadius: '0.25rem',
      marginTop: '0.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: '#333',
      fontSize: '1rem',
    },
    topCollegesList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    topCollegesItem: {
      padding: '0.25rem 0',
    },
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
    
    input: {
      flex: 1,
      padding: '0.5rem',
      border: '1px solid #D1D5DB',
      borderRadius: '0.5rem 0 0 0.5rem',
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
    inputContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      borderTop: '1px solid #E5E7EB',
      padding: '1rem',
    },
    dropdownContainer: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1rem',
    },
    select: {
      flex: 1,
      maxWidth: '150px', // Fixed width to prevent horizontal expansion
      padding: '0.5rem',
      border: '1px solid #D1D5DB',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: '#333',
      fontSize: '1rem',
      marginRight: '0.5rem',
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
          <button onClick={toggleWidget} style={{ color: 'black' }}>
            <X size={20} />
          </button>
        </div>
        <div style={styles.body}>
          {!showChat ? (
            <>
              <div style={styles.predictorCard}>
                <div style={styles.predictorLeft}>
                  <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Predict your College</h2>
                  <input
                    type="text"
                    value={score}
                    onChange={handleScoreChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Your Score..."
                    style={styles.predictorInput}
                  />
                </div>
                <div style={styles.predictorRight}>
                  <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Top Colleges</h3>
                  <ul style={styles.topCollegesList}>
                    {predictedColleges.map((college, index) => (
                      <li key={index} style={styles.topCollegesItem}>{college.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div style={{marginTop:'3rem'}}>
              <div style={styles.card}>
                <h2 style={{ marginBottom: '0.5rem' }}>Top News For You</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <button onClick={prevNews} style={styles.newsButtonStyles}>
                    <ChevronLeft size={20} />
                  </button>
                  <span>{`${currentNewsIndex + 1} / ${newsItems.length}`}</span>
                  <button onClick={nextNews} style={styles.newsButtonStyles}>
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div style={styles.newsCardStyles}>
                  <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{newsItems[currentNewsIndex].title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{newsItems[currentNewsIndex].description}</p>
                </div>
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
                     {message.isMarkdown ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={styles.inputContainer}>
          {!showChat && (
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              <select style={styles.select} value={selectedCollege} onChange={handleCollegeChange}>
                <option value="">Select College</option>
                {collegeList.map((college, index) => (
                  <option key={index} value={college.value}>
                    {college.name}
                  </option>
                ))}
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
            onKeyPress={keypress2}
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