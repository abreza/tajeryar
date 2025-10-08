"use client";
import { useState, useMemo } from "react";
import { Sheet, Stack, Typography, IconButton, Tooltip } from "@mui/joy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CodeIcon from "@mui/icons-material/Code";

interface JsonCodeBlockProps {
  data: unknown;
  title?: string;
}

export default function JsonCodeBlock({
  data,
  title = "داده",
}: JsonCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = useMemo(
    () => (typeof data === "string" ? data : JSON.stringify(data, null, 2)),
    [data]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no-op */
    }
  };

  return (
    <Stack spacing={0.75}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          level="body-xs"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <CodeIcon fontSize="small" /> {title}
        </Typography>
        <Tooltip title={copied ? "کپی شد!" : "کپی"}>
          <IconButton
            size="sm"
            variant="plain"
            color={copied ? "success" : "neutral"}
            onClick={handleCopy}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Sheet
        variant="soft"
        color="neutral"
        sx={{
          borderRadius: "md",
          p: 1.25,
          overflow: "auto",
          maxHeight: 260,
          direction: "ltr",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        <pre
          style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {jsonString}
        </pre>
      </Sheet>
    </Stack>
  );
}
