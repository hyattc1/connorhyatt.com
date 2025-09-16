import { useChatbot } from "@/contexts/ChatContext";
import { useChat } from "ai/react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/Accordion";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  const { isVisible, isOpen, toggleAccordion } = useChatbot();

  return (
    isVisible && (
      <Accordion type="single" collapsible className="flexs relative z-40" value={isOpen ? "item-1" : ""} onValueChange={toggleAccordion}>
        <AccordionItem
          value="item-1"
          className="fixed bottom-8 right-8 w-80 rounded-md border bg-foreground text-background border-foreground/20"
        >
          <AccordionTrigger className="border-b border-background/20 px-6">
            <ChatHeader />
          </AccordionTrigger>
          <AccordionContent className="flex max-h-96 min-h-80 flex-col justify-between p-0">
            <ChatMessages
              messages={messages}
              error={error}
              isLoading={isLoading}
            />
            <ChatInput
              input={input}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              setMessages={setMessages}
              isLoading={isLoading}
              messages={messages}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  );
}
