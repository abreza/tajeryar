"use client";

import { useState } from "react";
import { Box, Sheet, Alert, Button, useTheme } from "@mui/joy";
import RefreshIcon from "@mui/icons-material/Refresh";
// eslint-disable-next-line no-restricted-imports
import { useMediaQuery } from "@mui/material";

import { fadeInUp } from "./animations";
import { ChatbotProps, ChatMessage } from "./types";

import CollapsedChat from "./CollapsedChat";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import QuickPrompts from "./QuickPrompts";
import ChatInput from "./ChatInput";
import { useGenericChatbot } from "./useGenericChatbot";

export default function GenericChatbot({
  config,
  context,
  onMessageSent,
  className,
}: ChatbotProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const {
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
  } = useGenericChatbot(config, context, onMessageSent);

  if (!isExpanded) {
    return (
      <CollapsedChat
        title={config.collapsedTitle}
        onClick={() => setIsExpanded(true)}
      />
    );
  }

  return (
    <Sheet
      variant="outlined"
      className={className}
      sx={{
        borderRadius: "lg",
        width: "100%",
        height: 600,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.level1",
        boxShadow: "lg",
        overflow: "hidden",
        animation: `${fadeInUp} 0.3s ease-out`,
      }}
    >
      <ChatHeader
        title={config.title}
        subtitle={config.subtitle}
        isLoading={isLoading}
        onClose={() => setIsExpanded(false)}
        onReset={resetConversation}
      />

      <Box
        role="log"
        aria-live="polite"
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "neutral.outlinedBorder",
            borderRadius: 2,
          },
        }}
      >
        {messages.map((m, index) => (
          <MessageBubble
            key={m.id}
            message={m as ChatMessage}
            isLast={index === messages.length - 1}
            onCopy={handleCopyMessage}
            onFeedback={config.supportsFeedback ? handleFeedback : undefined}
            feedback={
              config.supportsFeedback ? messageFeedback[m.id] : undefined
            }
            supportsReasoning={config.supportsReasoning}
          />
        ))}

        {isLoading && <TypingIndicator />}

        {hasError && (
          <Alert
            color="danger"
            variant="soft"
            sx={{ alignSelf: "center", animation: `${fadeInUp} 0.3s ease-out` }}
            endDecorator={
              <Button
                variant="plain"
                color="danger"
                size="sm"
                onClick={retryLastMessage}
                startDecorator={<RefreshIcon />}
              >
                تلاش مجدد
              </Button>
            }
          >
            خطا در ارسال پیام رخ داد
          </Alert>
        )}

        {error && (
          <Alert
            color="warning"
            variant="soft"
            sx={{ alignSelf: "center", animation: `${fadeInUp} 0.3s ease-out` }}
            endDecorator={
              <Button
                variant="plain"
                color="warning"
                size="sm"
                onClick={() => setError(null)}
              >
                بستن
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {isFirstTurn && (
          <QuickPrompts
            sections={config.quickPrompts}
            onPromptClick={handleQuickPrompt}
          />
        )}

        <div ref={messagesEndRef} />
      </Box>

      <ChatInput
        input={input}
        setInput={setInput}
        handleKeyDown={handleKeyDown}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isDesktop={isDesktop}
        placeholder={config.placeholder}
      />
    </Sheet>
  );
}
