import { createContext, ReactNode, useContext, useState } from "react";

const ChatContext = createContext({
  isVisible: true,
  isOpen: false,
  toggleChatbot: () => {},
  openChatbot: () => {},
  toggleAccordion: () => {},
});

export const useChatbot = () => useContext(ChatContext);

interface Props {
  children: ReactNode;
}

export function ChatProvider({ children }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsVisible(!isVisible);
  };

  const openChatbot = () => {
    setIsVisible(true);
    setIsOpen(!isOpen); // Toggle the accordion state
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ChatContext.Provider value={{ isVisible, isOpen, toggleChatbot, openChatbot, toggleAccordion }}>
      {children}
    </ChatContext.Provider>
  );
}
