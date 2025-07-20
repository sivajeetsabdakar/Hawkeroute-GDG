'use client';

import React, { useState } from 'react';
import ChatAssistant from '@/components/ui/ChatAssistant';
import api from '@/lib/api';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (userMessage) => {
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);
    try {
      const res = await api.post('/api/ai-chat', { message: userMessage });
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Sorry, there was an error contacting the AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>AI Chat Assistant</h2>
      <ChatAssistant onSend={handleSend} messages={messages} loading={loading} />
    </div>
  );
};

export default ChatPage; 