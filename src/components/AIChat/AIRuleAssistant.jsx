import React, { useState } from 'react';
import { Sparkles, Send, Loader } from 'lucide-react';
import './AIRuleAssistant.css';

const AIRuleAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: '您好！我是您的排球知識庫。請問您想了解排球規則的哪個部份呢？'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!input.trim()) return;
    
    // 加入使用者訊息
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const currentQuestion = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://one14-1-volleygo-api.onrender.com/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 加入 AI 回應
      const aiMessage = {
        role: 'ai',
        content: data.answer
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('API Error:', error);
      
      // 顯示錯誤訊息
      const errorMessage = {
        role: 'ai',
        content: `抱歉，AI 暫時無法回答。錯誤訊息：${error.message}\n\n可能原因：\n1. 後端服務正在啟動中（Render 免費版會休眠，需要 30 秒喚醒）\n2. 網路連線問題\n3. API 服務暫時維護中\n\n請稍後再試！`
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <Sparkles className="ai-icon" />
        <h3>AI 排球顧問</h3>
      </div>

      <div className="chat-history">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.role === 'ai' ? 'ai-message' : 'user-message'}`}
          >
            <div className="message-header">
              <strong>{msg.role === 'ai' ? '🤖 AI 顧問' : '👤 您'}：</strong>
            </div>
            <p className="message-content">{msg.content}</p>
          </div>
        ))}
        
        {loading && (
          <div className="message ai-message loading-message">
            <div className="message-header">
              <strong>🤖 AI 顧問：</strong>
            </div>
            <div className="loading-dots">
              <Loader className="spinner" />
              <span>思考中...</span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="詢問排球問題，例如：攔網後的擊球權？"
          disabled={loading}
        />
        <button 
          onClick={askAI} 
          disabled={loading || !input.trim()}
          className="send-button"
        >
          <Send size={20} />
        </button>
      </div>

      <div className="ai-tips">
        <p>💡 <strong>提示：</strong>您可以詢問排球規則、戰術分析、賽事數據等問題</p>
        <p>⚠️ 首次詢問可能需要等待 60 秒（後端服務啟動中）</p>
      </div>
    </div>
  );
};

export default AIRuleAssistant;