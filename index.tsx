import React, { useState, useEffect, useRef, FormEvent } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Chat } from '@google/genai';
import { CHATBOT_PERSONALITY } from './personality';
import { KNOWLEDGE_BASE_STRUCTURED } from './knowledge';

// --- Web Speech API setup ---
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = false;
  recognition.lang = 'vi-VN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const getRelevantKnowledge = (query: string): string => {
  const lowerCaseQuery = query.toLowerCase();
  const relevantChunks = KNOWLEDGE_BASE_STRUCTURED.filter(item =>
    item.keywords.some(keyword => lowerCaseQuery.includes(keyword))
  );
  if (relevantChunks.length === 0) {
    return '';
  }
  return relevantChunks.map(chunk => chunk.content).join('\n\n');
};

// --- Detailed Error Handling ---
const handleApiError = (error: unknown): string => {
  console.error("API Error caught:", error);
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes('api key not valid')) {
      return "Lỗi: API key của bạn không hợp lệ hoặc bị thiếu. Vui lòng kiểm tra lại biến môi trường trên Vercel.";
    }
    if (errorMessage.includes('permission denied')) {
      return "Lỗi: API key của bạn không có quyền truy cập mô hình này. Có thể bạn cần bật thanh toán (billing) trên tài khoản Google Cloud của mình.";
    }
    if (errorMessage.includes('quota') || errorMessage.includes('resource has been exhausted')) {
      return "Lỗi: Bạn đã sử dụng hết hạn mức (quota) cho phép của API key này. Vui lòng thử lại sau hoặc sử dụng một key khác.";
    }
     if (errorMessage.includes('model not found')) {
      return "Lỗi: Tên mô hình AI không hợp lệ hoặc không tồn tại. Vui lòng kiểm tra lại mã nguồn.";
    }
    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return "Lỗi: Không thể kết nối đến máy chủ Gemini. Vui lòng kiểm tra kết nối mạng của bạn.";
    }
  }
  // Generic fallback message
  return 'Xin lỗi, tôi đang gặp một sự cố không mong muốn. Vui lòng thử lại sau.';
}


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [chatStarted, setChatStarted] = useState<boolean>(false);
  
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    try {
      if (!process.env.API_KEY) {
        throw new Error("[GoogleGenerativeAI Error]: API key not valid. Please pass a valid API key.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      aiRef.current = ai;
      chatRef.current = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: CHATBOT_PERSONALITY,
        },
      });
    } catch (error) {
       const userFriendlyError = handleApiError(error);
       // Display initialization error directly in the chat window
       setMessages([{ id: Date.now(), text: userFriendlyError, sender: 'bot' }]);
       setChatStarted(true);
    }
  }, []);

  useEffect(() => {
    if (chatStarted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, chatStarted]);
  
  // Effect for handling speech recognition events
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  }, []);


  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    if (!chatStarted) {
      setChatStarted(true);
    }

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    const retrievedKnowledge = getRelevantKnowledge(inputValue);
    
    let prompt: string;
    if (retrievedKnowledge) {
      prompt = `Dựa vào ngữ liệu kiến thức sau đây:\n\n---\n${retrievedKnowledge}\n---\n\nHãy trả lời câu hỏi của người dùng: "${inputValue}"`;
    } else {
      prompt = `Hãy trả lời câu hỏi của người dùng: "${inputValue}"`;
    }

    try {
      if (!chatRef.current) {
        throw new Error("Chat session chưa được khởi tạo.");
      }
      
      const response = await chatRef.current.sendMessage({ message: prompt });
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const userFriendlyError = handleApiError(error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: userFriendlyError,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMicClick = () => {
    if (!recognition) {
        alert("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.");
        return;
    }
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="header-logo-container">
          <img src="https://raw.githubusercontent.com/kimanhtv2009/PSYFRIEND/main/cropped_circle_image%20(2).png" alt="Logo" className="header-logo" />
        </div>
        <span>PsyFriend</span>
      </header>
      
      <main className={chatStarted ? "chat-messages" : "welcome-screen"}>
        {chatStarted ? (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <>
            <img src="https://raw.githubusercontent.com/kimanhtv2009/PSYFRIEND/main/cropped_circle_image%20(2).png" alt="PsyFriend Logo" className="welcome-logo" />
            <p className="welcome-text">
              Xin chào! Mình là PsyFriend, người bạn đồng hành về tâm lý học đường của bạn. 🌱
              <br/>
              Mình ở đây để lắng nghe và tạo một không gian an toàn để bạn chia sẻ.
            </p>
          </>
        )}
      </main>
      
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập tin nhắn của bạn..."
          aria-label="Chat input"
          disabled={isLoading && chatStarted}
        />
        <button type="submit" className="send-button" disabled={!inputValue.trim() || (isLoading && chatStarted)} aria-label="Send message">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
        {recognition && (
          <button type="button" className={`mic-button ${isRecording ? 'recording' : ''}`} onClick={handleMicClick} aria-label="Record message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          </button>
        )}
      </form>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);