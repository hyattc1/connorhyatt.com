"use client";

import { useChatbot } from "@/contexts/ChatContext";

export default function ClickableConnorSupport() {
  const { openChatbot } = useChatbot();

  return (
    <button
      onClick={openChatbot}
      className="font-semibold text-foreground hover:text-muted-foreground transition-colors cursor-pointer"
    >
      Connor Support
    </button>
  );
}
