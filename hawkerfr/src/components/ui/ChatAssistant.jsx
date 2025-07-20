import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

const ChatAssistant = ({ onSend, messages, loading }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, maxWidth: 400, margin: '0 auto' }}>
      <div style={{ minHeight: 200, maxHeight: 300, overflowY: 'auto', marginBottom: 12 }}>
        {messages.length === 0 && <div style={{ color: '#888' }}>Start a conversation with the AI assistant...</div>}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 8, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{ fontWeight: msg.role === 'user' ? 'bold' : 'normal' }}>
              {msg.role === 'user' ? 'You: ' : 'AI: '}
            </span>
            {msg.text}
          </div>
        ))}
        {loading && <div style={{ color: '#888' }}>AI is typing...</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Ask something..."
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatAssistant; 