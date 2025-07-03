import useChannels from './useChannels';

export default function useChannel() {
  const {
    active,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
  } = useChannels();

  return {
    activeChannel: active,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
  };
}