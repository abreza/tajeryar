"use client";
import { useState } from "react";
import { Sheet, Stack, Typography, IconButton, Tooltip } from "@mui/joy";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { MemoizedMarkdown } from "../../atom/MemoizedMarkdown";
// eslint-disable-next-line no-restricted-imports
import { Collapse } from "@mui/material";

interface ReasoningDisplayProps {
  content: string;
  title?: string;
}

export default function ReasoningDisplay({
  content,
  title = "استدلال مدل",
}: ReasoningDisplayProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  if (!content?.trim()) return null;

  return (
    <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "hidden" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 1, bgcolor: "neutral.softBg", cursor: "pointer" }}
        onClick={() => setOpen((v) => !v)}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <PsychologyIcon fontSize="small" />
          <Typography level="body-sm" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
            {content.length} کاراکتر
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title={copied ? "کپی شد!" : "کپی"}>
            <IconButton
              size="sm"
              variant="plain"
              color={copied ? "success" : "neutral"}
              onClick={(e) => {
                e.stopPropagation();
                copy();
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
        </Stack>
      </Stack>

      <Collapse in={open}>
        <Sheet
          variant="soft"
          sx={{ p: 1.25, borderTop: "1px solid", borderColor: "divider" }}
        >
          <MemoizedMarkdown id={`reasoning`} content={content} />
        </Sheet>
      </Collapse>
    </Sheet>
  );
}
