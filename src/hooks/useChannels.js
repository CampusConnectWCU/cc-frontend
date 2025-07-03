import { useState, useEffect, useRef } from 'react';
import {
  getChannelsMeta,
  searchChannels,
  markChannelRead,
  getChannelMessages,
  postMessage,
  findOrCreateDMChannel,
} from '../utils/channelHandler';
import { createSocket } from '../utils/api';

export default function useChannels() {
  const [channels, setChannels]      = useState([]);
  const [filtered, setFiltered]      = useState([]);
  const [active, setActive]          = useState(null);
  const [messages, setMessages]      = useState([]);
  const [newMessage, setNewMessage]  = useState('');
  const [search, setSearch]          = useState('');
  const socketRef                     = useRef(null);

  // open one socket for both channel‑list & messages
  useEffect(() => {
    socketRef.current = createSocket('/channels');
    socketRef.current.on('channelUpdated', refresh);
    socketRef.current.on('messageReceived', onIncoming);

    return () => {
      socketRef.current.off('channelUpdated', refresh);
      socketRef.current.off('messageReceived', onIncoming);
      socketRef.current.disconnect();
    };
  }, []);

  async function refresh() {
    const data = await getChannelsMeta();
    setChannels(data);
    applySearch(search, data);
  }

  useEffect(() => { refresh(); }, []);

  function applySearch(q, list = channels) {
    if (!q) return setFiltered(list);
    searchChannels(q).then(setFiltered);
  }

  // handle incoming over socket
  function onIncoming(msg) {
    // append to active if matches
    if (active?.channelId === msg.channelId) {
      setMessages(prev => [...prev, msg]);
    }
    // bump unread on others
    setChannels(prev =>
      prev.map(c =>
        c.channelId === msg.channelId
          ? { ...c, unreadCount: (c.unreadCount||0) + (active?.channelId===c.channelId?0:1) }
          : c
      )
    );
  }

  // pick (or create) a channel
  async function pick(ch) {
    if (active?.channelId === ch.channelId) return;
    socketRef.current.emit('leaveChannel', active?.channelId);
    setActive(ch);

    if (ch.unreadCount) {
      await markChannelRead(ch.channelId);
      socketRef.current.emit('markRead', ch.channelId);
    }
    socketRef.current.emit('joinChannel', ch.channelId);

    const { messages: hist = [] } = await getChannelMessages(ch.channelId);
    setMessages(hist);
  }

  async function newChannel(userId) {
    const ch = await findOrCreateDMChannel(userId);
    await refresh();
    pick(ch);
  }

  async function sendMessage(text) {
    if (!active || !text.trim()) return;
    const msg = await postMessage(active.channelId, text);
    setMessages(prev => [...prev, msg]);
    socketRef.current.emit('sendMessage', msg);
  }

  return {
    channels:  filtered,
    active,
    pick,
    search,
    setSearch: q => { setSearch(q); applySearch(q); },
    newChannel,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
  };
}
