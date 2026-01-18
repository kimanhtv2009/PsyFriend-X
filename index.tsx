import React, { useState, useEffect, useRef, FormEvent } from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Removed LiveSession as it is not an exported member of @google/genai
import { GoogleGenAI, Chat, Modality, LiveServerMessage, Blob } from '@google/genai';
import { CHATBOT_PERSONALITY } from './personality';
import { KNOWLEDGE_BASE_STRUCTURED } from './knowledge';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

// --- Helper Functions for Audio Processing ---

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
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


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [chatStarted, setChatStarted] = useState<boolean>(false);
  
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);
  
  // Refs for voice chat
  // FIX: Replaced LiveSession with any since it is not an exported type.
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  let nextStartTime = 0;
  
  // Refs for transcription
  const currentInputTranscription = useRef<string>('');
  const currentOutputTranscription = useRef<string>('');

  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      aiRef.current = ai;
      chatRef.current = ai.chats.create({
        // FIX: Updated model name to a supported model for complex chat tasks.
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: CHATBOT_PERSONALITY,
        },
      });
    } catch (error) {
       console.error("Lỗi khởi tạo Gemini:", error);
       // We can show an error on the welcome screen or as the first message
       if (!chatStarted) {
         // This is tricky, for now, we'll just log it. A better solution would be a global error state.
       } else {
         setMessages(prev => [...prev, {id: Date.now(), text: "Rất tiếc, đã có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra API key và thử lại.", sender: 'bot'}]);
       }
    }

    return () => {
        // Cleanup on unmount
        stopVoiceSession();
    }
  }, []);

  useEffect(() => {
    if (chatStarted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, chatStarted]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || isRecording) return;
    
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
      console.error('Lỗi khi gửi tin nhắn:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceSession = async () => {
    if (!aiRef.current || isRecording) return;

    if (!chatStarted) {
        setChatStarted(true);
    }

    setIsRecording(true);
    setIsLoading(true);

    try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

        // FIX: Cast window to any to access vendor-prefixed webkitAudioContext
        inputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        // FIX: Cast window to any to access vendor-prefixed webkitAudioContext
        outputAudioContextRef.current = new ((window as any).AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

        sessionPromiseRef.current = aiRef.current.live.connect({
            // FIX: Updated model name to the supported model for Live API.
            model: 'gemini-3-pro-preview',
            callbacks: {
                onopen: () => {
                    if (!inputAudioContextRef.current || !streamRef.current || !sessionPromiseRef.current) return;
                    const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
                    scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                    
                    scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromiseRef.current?.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    source.connect(scriptProcessorRef.current);
                    scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                   if (message.serverContent?.inputTranscription) {
                        currentInputTranscription.current += message.serverContent.inputTranscription.text;
                   }
                   if (message.serverContent?.outputTranscription) {
                        currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                   }

                   if (message.serverContent?.turnComplete) {
                        const userMessage: Message = { id: Date.now(), text: currentInputTranscription.current, sender: 'user' };
                        const botMessage: Message = { id: Date.now() + 1, text: currentOutputTranscription.current, sender: 'bot' };
                        
                        setMessages(prev => [...prev.filter(m => m.id !== -1), userMessage, botMessage]);
                        
                        currentInputTranscription.current = '';
                        currentOutputTranscription.current = '';
                   } else {
                        // Live update transcription
                        const liveUserMessage: Message = { id: -1, text: currentInputTranscription.current + "...", sender: 'user' };
                        setMessages(prev => [...prev.filter(m => m.id !== -1), liveUserMessage]);
                   }
                    
                   const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                   if (base64Audio && outputAudioContextRef.current) {
                        nextStartTime = Math.max(nextStartTime, outputAudioContextRef.current.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                        const source = outputAudioContextRef.current.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContextRef.current.destination);
                        source.addEventListener('ended', () => sourcesRef.current.delete(source));
                        source.start(nextStartTime);
                        nextStartTime += audioBuffer.duration;
                        sourcesRef.current.add(source);
                   }

                   if(message.serverContent?.interrupted) {
                       for (const source of sourcesRef.current.values()) {
                           source.stop();
                           sourcesRef.current.delete(source);
                       }
                       nextStartTime = 0;
                   }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Lỗi voice session:', e);
                    setMessages(prev => [...prev, { id: Date.now(), text: "Lỗi kết nối voice chat. Vui lòng thử lại.", sender: 'bot' }]);
                    stopVoiceSession();
                },
                onclose: (e: CloseEvent) => {
                    stopVoiceSession();
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                outputAudioTranscription: {},
                systemInstruction: CHATBOT_PERSONALITY,
            },
        });
    } catch (error) {
        console.error('Không thể bắt đầu voice session:', error);
        setMessages(prev => [...prev, {id: Date.now(), text: "Không thể truy cập micro. Vui lòng cấp quyền và thử lại.", sender: 'bot'}]);
        stopVoiceSession();
    }
  };

  const stopVoiceSession = () => {
      setIsRecording(false);
      setIsLoading(false);

      sessionPromiseRef.current?.then(session => session.close());
      sessionPromiseRef.current = null;

      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;

      scriptProcessorRef.current?.disconnect();
      scriptProcessorRef.current = null;

      inputAudioContextRef.current?.close();
      outputAudioContextRef.current?.close();
      inputAudioContextRef.current = null;
      outputAudioContextRef.current = null;
      
      currentInputTranscription.current = '';
      currentOutputTranscription.current = '';
      setMessages(prev => prev.filter(m => m.id !== -1));
  };
  
  const toggleVoiceChat = () => {
    if (isRecording) {
        stopVoiceSession();
    } else {
        startVoiceSession();
    }
  }

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
            {isLoading && !isRecording && (
              <div className="message bot loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            {isRecording && (
                <div className="message bot">Đang lắng nghe...</div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <>
            <img src="https://raw.githubusercontent.com/kimanhtv2009/PSYFRIEND/main/cropped_circle_image%20(2).png" alt="PsyFriend Logo" className="welcome-logo" />
            <p className="welcome-text">
              Xin chào! Mình là PsyFriend, người bạn đồng hành về tâm lý học đường
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
          placeholder={isRecording ? "Đang lắng nghe..." : "Nhập tin nhắn của bạn..."}
          aria-label="Chat input"
          disabled={isLoading && chatStarted}
        />
        <button type="button" className={`mic-button ${isRecording ? 'recording' : ''}`} onClick={toggleVoiceChat} aria-label={isRecording ? 'Stop recording' : 'Start recording'}>
          {/* FIX: Corrected the viewBox attribute for the SVG element. */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
        </button>
        <button type="submit" className="send-button" disabled={!inputValue.trim() || (isLoading && chatStarted) || isRecording} aria-label="Send message">
          {/* FIX: Removed duplicate viewBox attribute from SVG element. */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
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
