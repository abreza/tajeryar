"use client";
import {
  Stack,
  Avatar,
  Sheet,
  Typography,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/joy";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { MemoizedMarkdown } from "../../atom/MemoizedMarkdown";
import { ChatMessage } from "./types";
import { fadeInUp } from "./animations";
import ToolCard, { type ToolState } from "./ToolCard";
import ReasoningDisplay from "./ReasoningDisplay";

interface MessageBubbleProps {
  message: ChatMessage;
  isLast: boolean;
  onCopy: (text: string) => void;
  onFeedback?: (messageId: string, feedback: "positive" | "negative") => void;
  feedback?: "positive" | "negative";
  supportsReasoning?: boolean;
}

export default function MessageBubble({
  message,
  isLast,
  onCopy,
  onFeedback,
  feedback,
  supportsReasoning = true,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  const plainText = (message.parts ?? [])
    .filter((p) => p.type === "text")
    .map((p: any) => ("text" in p ? p.text : ""))
    .join("");

  const formatTime = (date: Date) =>
    new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  const renderPart = (part: any, idx: number) => {
    if (part.type === "step-start") {
      return <Divider key={`${message.id}-sep-${idx}`} sx={{ my: 1 }} />;
    }

    if (
      (part.type === "reasoning" || part.type === "thinking") &&
      supportsReasoning
    ) {
      return (
        <ReasoningDisplay
          key={`${message.id}-reasoning-${idx}`}
          content={part.text || part.content || ""}
        />
      );
    }

    // Handle tool calls and results (AI SDK format)
    if (part.type === "tool-call") {
      return (
        <ToolCard
          key={`${message.id}-tool-call-${idx}`}
          toolName={part.toolName}
          state="input-available"
          input={part.args}
        />
      );
    }

    if (part.type === "tool-result") {
      const hasError = part.result?.error || part.isError;
      return (
        <ToolCard
          key={`${message.id}-tool-result-${idx}`}
          toolName={part.toolName}
          state={hasError ? "output-error" : "output-available"}
          input={part.args}
          output={hasError ? undefined : part.result}
          errorText={hasError ? part.result?.error || "خطای نامشخص" : undefined}
        />
      );
    }

    // Handle dynamic tools (legacy format)
    if (part.type === "dynamic-tool") {
      return (
        <ToolCard
          key={`${message.id}-dyn-${idx}`}
          toolName={part.toolName}
          state={part.state as ToolState}
          input={"input" in part ? part.input : undefined}
          output={part.state === "output-available" ? part.output : undefined}
          errorText={part.state === "output-error" ? part.errorText : undefined}
        />
      );
    }

    // Handle tool types (legacy format)
    if (typeof part.type === "string" && part.type.startsWith("tool-")) {
      const toolName = part.type.replace("tool-", "");
      return (
        <ToolCard
          key={`${message.id}-tool-${idx}`}
          toolName={toolName}
          state={part.state as ToolState}
          input={part.input}
          output={part.state === "output-available" ? part.output : undefined}
          errorText={part.state === "output-error" ? part.errorText : undefined}
        />
      );
    }

    if (part.type === "text") {
      return (
        <MemoizedMarkdown
          key={`${message.id}-text-${idx}`}
          id={message.id}
          content={part.text ?? ""}
        />
      );
    }

    return null;
  };

  return (
    <Stack
      direction={isUser ? "row-reverse" : "row"}
      spacing={1.5}
      sx={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: { xs: "90%", sm: "80%" },
        animation: `${fadeInUp} 0.3s ease-out`,
      }}
    >
      <Avatar
        variant={isUser ? "solid" : "soft"}
        color={isUser ? "primary" : "neutral"}
        size="sm"
        sx={{
          flexShrink: 0,
          ...(isUser && {
            background:
              "linear-gradient(135deg, var(--joy-palette-primary-500), var(--joy-palette-primary-600))",
          }),
        }}
      >
        {isUser ? (
          <PersonOutlineOutlinedIcon fontSize="small" />
        ) : (
          <SmartToyOutlinedIcon fontSize="small" />
        )}
      </Avatar>

      <Stack spacing={0.5}>
        <Sheet
          variant={isUser ? "solid" : "soft"}
          color={isUser ? "primary" : "neutral"}
          sx={{
            p: 1.5,
            borderRadius: "lg",
            boxShadow: "sm",
            lineHeight: 1.7,
            wordBreak: "break-word",
            whiteSpace: "normal",
            position: "relative",
            transition: "all 0.2s ease",
            ...(isUser && {
              background:
                "linear-gradient(135deg, var(--joy-palette-primary-500), var(--joy-palette-primary-600))",
            }),
            "& p": { m: 0, mb: 0.75 },
            "& pre": {
              p: 1,
              overflowX: "auto",
              borderRadius: "md",
              bgcolor: isUser ? "rgba(255,255,255,0.1)" : "neutral.softBg",
              border: "1px solid",
              borderColor: "divider",
            },
            "& code": {
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              px: 0.5,
              pt: 0.25,
              pb: 0.5,
              borderRadius: "sm",
              bgcolor: isUser ? "rgba(255,255,255,0.1)" : "neutral.softBg",
            },
            "& ul, & ol": { pl: 3, mb: 0.75 },
            "& h1, & h2, & h3": { mt: 1, mb: 0.75, lineHeight: 1.35 },
          }}
        >
          {(message.parts ?? []).map((part, idx) => renderPart(part, idx))}

          {message.timestamp && isLast && (
            <Typography
              level="body-xs"
              sx={{
                color: "text.tertiary",
                alignSelf: "flex-start",
                position: "absolute",
                bottom: 2,
                right: isUser ? "auto" : 10,
                left: isUser ? 10 : "auto",
                fontSize: "10px!important",
              }}
            >
              {formatTime(message.timestamp)}
            </Typography>
          )}
        </Sheet>

        {!isUser && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              alignSelf: "flex-start",
              animation: `${fadeInUp} 0.2s ease-out`,
            }}
          >
            <Tooltip title="کپی پیام">
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                onClick={() => onCopy(plainText)}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {onFeedback && (
              <>
                <Tooltip title="مفید بود">
                  <IconButton
                    size="sm"
                    variant={feedback === "positive" ? "soft" : "plain"}
                    color={feedback === "positive" ? "success" : "neutral"}
                    onClick={() => onFeedback(message.id, "positive")}
                  >
                    <ThumbUpIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="مفید نبود">
                  <IconButton
                    size="sm"
                    variant={feedback === "negative" ? "soft" : "plain"}
                    color={feedback === "negative" ? "danger" : "neutral"}
                    onClick={() => onFeedback(message.id, "negative")}
                  >
                    <ThumbDownIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
