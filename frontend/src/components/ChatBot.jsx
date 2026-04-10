// src/components/ChatBot.jsx
import { useState, useRef, useEffect } from 'react';
import API from '../api/axios';

export default function ChatBot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '🌸 Namaste! I\'m Sakhi, your beauty assistant. How can I help you today? 💄' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await API.post('/chatbot/message', { message: msg });
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch (error) {
      const fallback = error?.response?.data?.message || 'Sorry, I\'m unavailable right now. Please try again later! 🙏';
      setMessages(prev => [...prev, { from: 'bot', text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  const send = () => sendMessage(input);
  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      {/* Floating button */}
      <button style={styles.fab} onClick={() => setOpen(o => !o)} aria-label="Chat">
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={styles.window}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerInfo}>
              <div style={styles.avatar}>💄</div>
              <div>
                <div style={styles.botName}>Sakhi Assistant</div>
                <div style={styles.botStatus}>● Online</div>
              </div>
            </div>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                {m.from === 'bot' && <div style={styles.botAvatar}>💄</div>}
                <div style={m.from === 'user' ? styles.userBubble : styles.botBubble}>
                  {m.text.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingLeft: 8 }}>
                <div style={styles.botAvatar}>💄</div>
                <div style={styles.botBubble}><span style={styles.typing}>● ● ●</span></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div style={styles.quickReplies}>
            {[
              { label: '💆 Facial services', value: 'facial services' },
              { label: '👰 Bridal makeup', value: 'bridal packages' },
              { label: '🌿 Mehndi designs', value: 'mehndi designs' },
              { label: '🧵 Silai / Silai services', value: 'silai services' },
              { label: '✂️ Hair cutting', value: 'hair cutting' },
              { label: '🎉 Offers', value: 'offers' },
              { label: '💰 Price list', value: 'price list' },
            ].map(q => (
              <button key={q.value} style={styles.quickBtn} onClick={() => sendMessage(q.value)}>
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={styles.inputRow}>
            <input
              style={styles.chatInput}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything…"
            />
            <button style={styles.sendBtn} onClick={send} disabled={!input.trim() || loading}>
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes typingPulse { 0%,80%,100%{opacity:0.3} 40%{opacity:1} }
      `}</style>
    </>
  );
}

const styles = {
  fab: { position: 'fixed', bottom: 28, right: 28, width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #e8637a, #c94d65)', color: '#fff', fontSize: 26, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(232,99,122,0.4)', zIndex: 999, transition: 'transform 0.2s' },
  window: { position: 'fixed', bottom: 100, right: 28, width: 360, maxHeight: 520, background: '#fff', borderRadius: 20, boxShadow: '0 12px 48px rgba(26,10,15,0.2)', zIndex: 999, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeInUp 0.25s ease' },
  header: { background: 'linear-gradient(135deg, #e8637a, #c94d65)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerInfo: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 38, height: 38, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 },
  botName: { color: '#fff', fontWeight: 700, fontSize: 15 },
  botStatus: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  closeBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14 },
  messages: { flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 280 },
  botAvatar: { width: 28, height: 28, background: '#fce8ec', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, marginRight: 6, alignSelf: 'flex-end' },
  botBubble: { background: '#fce8ec', color: '#3d1f28', padding: '10px 14px', borderRadius: '18px 18px 18px 4px', fontSize: 13, lineHeight: 1.6, maxWidth: '80%' },
  userBubble: { background: 'linear-gradient(135deg, #e8637a, #c94d65)', color: '#fff', padding: '10px 14px', borderRadius: '18px 18px 4px 18px', fontSize: 13, lineHeight: 1.6, maxWidth: '80%' },
  typing: { letterSpacing: 2, animation: 'typingPulse 1.4s infinite' },
  quickReplies: { padding: '8px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid #f0dde2' },
  quickBtn: { fontSize: 11, padding: '4px 10px', border: '1px solid #f0dde2', borderRadius: 20, background: '#fff', color: '#e8637a', cursor: 'pointer', fontWeight: 500 },
  inputRow: { display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid #f0dde2', alignItems: 'center' },
  chatInput: { flex: 1, border: '1.5px solid #f0dde2', borderRadius: 20, padding: '10px 14px', fontSize: 13, outline: 'none', fontFamily: "'DM Sans', sans-serif" },
  sendBtn: { width: 38, height: 38, borderRadius: '50%', background: '#e8637a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
};
