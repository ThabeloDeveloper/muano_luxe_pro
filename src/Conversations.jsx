import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, live } from './firebase';

const time = value => value?.toDate?.().toLocaleString() || 'Just now';
export default function Conversations() {
  const [threads, setThreads] = useState([]), [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]), [count, setCount] = useState(50), [messageCount, setMessageCount] = useState(50);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!live) return;
    return onSnapshot(query(collection(db, 'conversations'), orderBy('updatedAt', 'desc'), limit(count)), s => setThreads(s.docs.map(d => ({id:d.id,...d.data()}))), () => setError('Conversation history could not be loaded.'));
  }, [count]);
  useEffect(() => {
    setMessages([]);
    if (!live || !selected) return;
    return onSnapshot(query(collection(db, 'conversations', selected.id, 'messages'), orderBy('createdAt', 'desc'), limit(messageCount)), s => setMessages(s.docs.map(d=>({id:d.id,...d.data()})).reverse()), () => setError('Messages could not be loaded.'));
  }, [selected?.id, messageCount]);
  return <section className="admin-card">
    <h2>Conversations</h2>
    <p className="admin-note">Customer messages and AI replies, recorded from activation onward. Earlier chats were not saved. Email and external messaging are not included.</p>
    {error && <p role="alert">{error}</p>}
    <div className="conversation-workspace">
      <div className="conversation-list">
        {!threads.length && <p>{live ? 'No conversations yet.' : 'Live customer conversations appear here after sign-in.'}</p>}
        {threads.map(t=><button key={t.id} className={selected?.id===t.id?'selected':''} onClick={()=>{setSelected(t);setMessageCount(50);}}>
          <strong>{t.userId ? 'Signed-in customer' : 'Guest visitor'} · AI assistant</strong>
          <span>{t.preview}</span><small>{time(t.updatedAt)}</small>
        </button>)}
        {threads.length >= count && <button onClick={()=>setCount(n=>n+50)}>Load older conversations</button>}
      </div>
      <div className="conversation-transcript">
        {!selected ? <p>Select a conversation to read its history.</p> : <>
          <h3>Conversation history</h3>
          <p className="admin-note">{selected.userId ? `Account ID: ${selected.userId}` : 'Guest session'} · {selected.id.slice(0,12)}</p>
          {messages.length >= messageCount && <button onClick={()=>setMessageCount(n=>n+50)}>Load earlier messages</button>}
          {messages.map(m=><article key={m.id}>
            <small>{time(m.createdAt)}</small>
            <h4>Customer</h4><p>{m.userText}</p>
            <h4>AI assistant</h4><p>{m.assistantText || (m.status==='failed' ? 'The assistant could not reply to this message.' : 'Awaiting response…')}</p>
          </article>)}
        </>}
      </div>
    </div>
  </section>;
}
