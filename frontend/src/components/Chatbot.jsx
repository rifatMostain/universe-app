import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/Chatbot.css';

const parseMessageWithFormatting = (text) => {
  if (!text) return [];
  
  const parts = [];
  let currentIndex = 0;
  
  // Combined regex for links, bold, italic, lists
  const regex = /(\[([^\]]+)\]\(([^\)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\n\s*\*\s+)/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      const beforeText = text.substring(currentIndex, match.index);
      if (beforeText) {
        parts.push({ type: 'text', content: beforeText });
      }
    }
    
    // Check what type of match it is
    if (match[1]) {
      // Link: [text](url)
      parts.push({ type: 'link', text: match[2], url: match[3] });
    } else if (match[4]) {
      // Bold: **text**
      parts.push({ type: 'bold', content: match[5] });
    } else if (match[6]) {
      // Italic: *text*
      parts.push({ type: 'italic', content: match[7] });
    } else if (match[8]) {
      // List item: * 
      parts.push({ type: 'bullet', content: ' • ' });
    }
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(currentIndex) });
  }
  
  return parts.length > 0 ? parts : [{ type: 'text', content: text }];
};

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, [user]);

  const loadChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token && user) {
        // Load from backend for logged-in users
        const response = await api.get('/ai/chat-history');
        
        if (response.data.messages && response.data.messages.length > 0) {
          setMessages(response.data.messages);
        }
      } else {
        // Load from sessionStorage for anonymous users
        const savedMessages = sessionStorage.getItem('chatMessages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      }
    } catch (error) {
      // Silently fail - user can start fresh conversation
    }
  };

  const saveChatMessage = async (role, content) => {
    const token = localStorage.getItem('token');
    
    if (token && user) {
      // Save to backend for logged-in users
      try {
        await api.post('/ai/save-message', { role, content });
      } catch (error) {
        // Continue even if save fails
      }
    }
  };

  // Save to sessionStorage whenever messages change (for anonymous users)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !user && messages.length > 0) {
      sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsStreaming(true);

    // Create a placeholder for AI response
    const aiMessageId = Date.now();
    const aiMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, aiMessage]);

    try {
      const token = localStorage.getItem('token');
      const isLoggedIn = !!token;
      
      // Build the full URL for streaming
      const baseURL = import.meta.env.VITE_API_URL || '/api';
      const chatURL = `${baseURL}/ai/chat`;
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(chatURL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: inputMessage.trim(),
          conversationHistory: messages.slice(-10)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      // Save user message
      await saveChatMessage('user', userMessage.content);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAIResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setIsStreaming(false);
          
          // Save AI response
          await saveChatMessage('assistant', fullAIResponse);
          
          // Add login prompt at the end for anonymous users
          if (!isLoggedIn) {
            setMessages(prev => prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: msg.content + '\n\n---\n💡 Want more features? [Login](/login) or [Sign up](/signup) to save your conversations and access advanced features!' }
                : msg
            ));
          }
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              setIsStreaming(false);
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.error) {
                console.error('Stream error:', parsed.error);
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId 
                    ? { ...msg, content: msg.content + '\n\n[Error: Stream interrupted]' }
                    : msg
                ));
                break;
              }

              if (parsed.text) {
                fullAIResponse += parsed.text;
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId 
                    ? { ...msg, content: msg.content + parsed.text }
                    : msg
                ));
              }
            } catch (parseError) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
          : msg
      ));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const clearChat = async () => {
    const token = localStorage.getItem('token');
    
    if (token && user) {
      // Clear from backend for logged-in users
      try {
        await api.delete('/ai/chat-history');
      } catch (error) {
        console.error('Error clearing chat history:', error);
      }
    } else {
      // Clear sessionStorage for anonymous users
      sessionStorage.removeItem('chatMessages');
    }
    
    setMessages([]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <button onClick={onClose} className="back-btn" title="Back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="chatbot-icon">🤖</div>
          <div>
            <h2>UniVerse AI</h2>
            <span className="chatbot-status">online</span>
          </div>
        </div>
        <div className="chatbot-header-actions">
          <button 
            onClick={clearChat} 
            className="clear-chat-btn"
            disabled={messages.length === 0}
            title="Clear Chat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h3>👋 Welcome to your AI University Counselor!</h3>
            <p>Ask me anything about:</p>
            <ul>
              <li>University requirements and programs</li>
              <li>Admission procedures</li>
              <li>Scholarships and financial aid</li>
              <li>Study destinations and visa information</li>
              <li>Application tips and guidance</li>
            </ul>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6c757d' }}>
              💡 No login required! Start chatting right away.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {message.content ? (
                    parseMessageWithFormatting(message.content).map((part, idx) => {
                      if (part.type === 'link') {
                        return <Link key={idx} to={part.url} className="chat-link">{part.text}</Link>;
                      } else if (part.type === 'bold') {
                        return <strong key={idx}>{part.content}</strong>;
                      } else if (part.type === 'italic') {
                        return <em key={idx}>{part.content}</em>;
                      } else if (part.type === 'bullet') {
                        return <span key={idx} className="bullet-point">{part.content}</span>;
                      } else {
                        return <span key={idx}>{part.content}</span>;
                      }
                    })
                  ) : (isStreaming && message.role === 'assistant' ? '...' : '')}
                </div>
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chatbot-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="chatbot-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !inputMessage.trim()}
          title="Send message"
        >
          {isLoading ? (
            <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </form>

      {isStreaming && (
        <div className="streaming-indicator">
          <span className="typing-animation">AI is typing</span>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
