"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatbotConfig } from "./types";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useGenericChatbot(
  config: ChatbotConfig,
  context?: Record<string, any>,
  onMessageSent?: (message: string) => void
) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [messageFeedback, setMessageFeedback] = useState<
    Record<string, "positive" | "negative">
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contextRef = useRef(context);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const { messages, sendMessage, status, stop, regenerate, setMessages } =
    useChat({
      transport: new DefaultChatTransport({
        api: config.apiEndpoint,
        prepareSendMessagesRequest: (params: any) => {
          return { body: { ...params, ...contextRef.current } };
        },
      }),
      messages: config.initialMessages,
      experimental_throttle: 50,
    });

  const isLoading = status === "submitted" || status === "streaming";
  const hasError = status === "error";

  const handleSubmit = async (e?: React.FormEvent, images?: File[]) => {
    e?.preventDefault?.();
    const text = input.trim();

    if (!text && (!images || images.length === 0)) return;
    if (isLoading) return;

    setError(null);

    try {
      const parts: any[] = [];

      if (text) {
        parts.push({ type: "text", text });
      }

      if (images && images.length > 0) {
        for (const image of images) {
          const dataUrl = await fileToDataUrl(image);

          parts.push({
            type: "image",
            image: dataUrl,
          });
        }
      }

      const messageText = text || "لطفاً این تصویر را بررسی کن";

      await sendMessage({
        parts,
        text: messageText as any,
      });

      setInput("");
      onMessageSent?.(text || "عکس ارسال شد");
    } catch (err) {
      setError("ارسال پیام با خطا مواجه شد. دوباره تلاش کنید.");
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleCopyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  const handleFeedback = (
    messageId: string,
    feedback: "positive" | "negative"
  ) => {
    setMessageFeedback((prev) => ({
      ...prev,
      [messageId]: feedback,
    }));
  };

  const resetConversation = () => {
    stop?.();
    setInput("");
    setError(null);
    setMessageFeedback({});
    setMessages(config.initialMessages);
  };

  const retryLastMessage = () => {
    setError(null);
    regenerate();
  };

  const isFirstTurn = useMemo(
    () => messages.filter((m) => m.role === "user").length === 0,
    [messages]
  );

  return {
    messages,
    isLoading,
    hasError,
    error,
    setError,
    isFirstTurn,
    input,
    setInput,
    messageFeedback,
    messagesEndRef,
    handleSubmit,
    handleKeyDown,
    handleQuickPrompt,
    handleCopyMessage,
    handleFeedback,
    resetConversation,
    retryLastMessage,
  };
}
