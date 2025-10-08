"use client";
import { useState } from "react";
import { Sheet, Stack, Typography, Chip, IconButton } from "@mui/joy";
import BuildIcon from "@mui/icons-material/Build";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from "@mui/joy/CircularProgress";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import JsonCodeBlock from "./JsonCodeBlock";
import { MemoizedMarkdown } from "../../atom/MemoizedMarkdown";
// eslint-disable-next-line no-restricted-imports
import { Collapse } from "@mui/material";

export type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error"
  | "executing";

function iconFor(state: ToolState, toolName?: string) {
  if (toolName === "fileRetrievalTool" || toolName?.includes("file")) {
    return <DescriptionIcon fontSize="small" color="primary" />;
  }
  if (toolName?.includes("search")) {
    return <SearchIcon fontSize="small" color="info" />;
  }

  switch (state) {
    case "input-streaming":
      return <CircularProgress size="sm" />;
    case "input-available":
      return <AutoFixHighIcon fontSize="small" />;
    case "output-available":
      return <CheckCircleIcon fontSize="small" color="success" />;
    case "output-error":
      return <ErrorIcon fontSize="small" color="error" />;
    case "executing":
      return <CircularProgress size="sm" />;
    default:
      return <BuildIcon fontSize="small" />;
  }
}

function cfg(state: ToolState, toolName?: string) {
  if (toolName === "fileRetrievalTool" || toolName?.includes("file")) {
    switch (state) {
      case "output-available":
        return { chip: "اطلاعات دریافت شد", color: "success" as const };
      case "output-error":
        return { chip: "خطا در دریافت", color: "danger" as const };
      case "executing":
      case "input-streaming":
        return { chip: "در حال دریافت...", color: "warning" as const };
      default:
        return { chip: "آماده دریافت", color: "primary" as const };
    }
  }

  switch (state) {
    case "input-streaming":
      return { chip: "در حال پردازش", color: "neutral" as const };
    case "input-available":
      return { chip: "در حال اجرا", color: "warning" as const };
    case "output-available":
      return { chip: "تکمیل شد", color: "success" as const };
    case "output-error":
      return { chip: "خطا", color: "danger" as const };
    case "executing":
      return { chip: "در حال اجرا...", color: "warning" as const };
    default:
      return { chip: "وضعیت نامشخص", color: "neutral" as const };
  }
}

interface Props {
  toolName: string;
  state: ToolState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  collapsible?: boolean;
}

export default function ToolCard({
  toolName,
  state,
  input,
  output,
  errorText,
  collapsible = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const { chip, color } = cfg(state, toolName);
  const hasContent = Boolean(input || output || errorText);

  const getTitle = () => {
    if (toolName === "fileRetrievalTool") {
      return "بازیابی اطلاعات فایل";
    }
    if (toolName?.includes("search")) {
      return "جستجو";
    }

    const statePrefix =
      state === "input-streaming"
        ? "آماده‌سازی ابزار"
        : state === "input-available"
          ? "اجرای ابزار"
          : state === "output-available"
            ? "نتیجه ابزار"
            : state === "output-error"
              ? "خطای ابزار"
              : "ابزار";

    return `${statePrefix} «${toolName}»`;
  };

  return (
    <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "hidden" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          p: 1,
          bgcolor: "background.level2",
          cursor: hasContent && collapsible ? "pointer" : "default",
        }}
        onClick={
          hasContent && collapsible ? () => setOpen((v) => !v) : undefined
        }
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {iconFor(state, toolName)}
          <Typography level="body-sm" sx={{ fontWeight: 700 }}>
            {getTitle()}
          </Typography>
          <Chip size="sm" color={color} variant="soft">
            {chip}
          </Chip>
        </Stack>

        {hasContent && collapsible && (
          <IconButton
            size="sm"
            variant="plain"
            sx={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform .2s",
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Stack>

      {hasContent && (
        <Collapse in={open}>
          <Stack spacing={1} sx={{ p: 1.25 }}>
            {input !== undefined && (
              <JsonCodeBlock data={input} title="ورودی ابزار" />
            )}
            {state === "output-available" && output !== undefined && (
              <JsonCodeBlock data={output} title="خروجی ابزار" />
            )}
            {state === "output-error" && errorText && (
              <Sheet
                variant="soft"
                color="danger"
                sx={{ p: 1, borderRadius: "sm" }}
              >
                <Typography level="body-xs" sx={{ fontWeight: 700, mb: 0.5 }}>
                  پیام خطا
                </Typography>
                <MemoizedMarkdown
                  id={`tool-error-${toolName}`}
                  content={String(errorText)}
                />
              </Sheet>
            )}
          </Stack>
        </Collapse>
      )}
    </Sheet>
  );
}
