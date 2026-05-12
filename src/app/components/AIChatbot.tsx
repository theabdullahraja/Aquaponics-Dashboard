import { Bot, Send, X, Minimize2, Maximize2, Paperclip, Mic } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatbot({ isOpen, onClose }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const quickQuestions = [
    'How to optimize pH levels?',
    'What causes low flow rate?',
    'Best practices for fish care',
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content:
          "I can help with that. Start with stable water checks, then adjust in small steps and watch trends for at least one cycle before further changes.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="hidden lg:flex fixed bottom-5 right-5 w-[360px] rounded-xl border border-border-subtle bg-card shadow-2xl z-50 flex-col">
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-aqua-blue" />
            <p className="text-sm font-semibold text-foreground">AI Assistant</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 rounded-md hover:bg-surface-dark transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-surface-dark transition-colors"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="p-3 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Send a quick message..."
            className="flex-1 bg-input border border-border-subtle rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aqua-blue/40"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-aqua-blue rounded-lg hover:opacity-95 transition-all"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 w-full lg:w-[360px] h-screen bg-card lg:border-l border-border-subtle flex flex-col z-50 shadow-2xl">
      <div className="h-[60px] px-6 flex items-center justify-between border-b border-border-subtle bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-aqua-blue flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-foreground">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-surface-dark rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-dark rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-aqua-blue/10 flex items-center justify-center">
              <Bot className="w-10 h-10 text-aqua-blue" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Aquaponics Assistant</h4>
              <p className="text-sm text-muted-foreground mb-6">Ask for help with:</p>
            </div>

            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-aqua-blue rounded-full" />
                System setup and optimization
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-growth rounded-full" />
                Fish care best practices
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-warm-amber rounded-full" />
                Plant health troubleshooting
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-aqua-blue-light rounded-full" />
                Data interpretation
              </div>
            </div>

            <div className="space-y-2 w-full pt-4">
              <p className="text-xs text-muted-foreground mb-2">Quick Questions:</p>
              {quickQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full p-3 bg-surface-dark/50 border border-border-subtle rounded-xl text-sm text-foreground hover:bg-surface-dark hover:border-aqua-blue/30 transition-all text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.type === 'user'
                      ? 'bg-aqua-blue text-white rounded-2xl rounded-br-md'
                      : 'bg-surface-dark border border-border-subtle rounded-2xl rounded-bl-md'
                  } p-4`}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-aqua-blue flex items-center justify-center mb-2">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface-dark border border-border-subtle rounded-2xl rounded-bl-md p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-aqua-blue rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-aqua-blue rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="w-2 h-2 bg-aqua-blue rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-4 border-t border-border-subtle bg-surface-dark/30">
        {messages.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {quickQuestions.slice(0, 2).map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-1.5 bg-surface-dark border border-border-subtle rounded-full text-xs text-foreground hover:border-aqua-blue/30 transition-all whitespace-nowrap flex-shrink-0"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-surface-dark rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your question..."
            className="flex-1 bg-input border border-border-subtle rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aqua-blue/50"
          />

          <button
            onClick={handleSendMessage}
            className="p-2.5 bg-aqua-blue rounded-xl hover:opacity-95 transition-all"
          >
            <Send className="w-5 h-5 text-white" />
          </button>

          <button className="p-2.5 hover:bg-surface-dark rounded-lg transition-colors">
            <Mic className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
