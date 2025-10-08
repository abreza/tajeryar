import React, { useRef, useState } from "react";
import {
  Box,
  Textarea,
  Tooltip,
  IconButton,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/joy";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { useVoiceTranscription } from "../../../hooks/useVoiceTranscription";
import { VoiceRecordingButton } from "../../../components/atom/VoiceRecordingButton";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent, images?: File[]) => void;
  isLoading: boolean;
  isDesktop: boolean;
  placeholder: string;
}

export default function ChatInput({
  input,
  setInput,
  handleKeyDown,
  handleSubmit,
  isLoading,
  isDesktop,
  placeholder,
}: ChatInputProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTranscriptionComplete = (text: string) => {
    const newText = input.trim() ? `${input.trim()} ${text}` : text;
    setInput(newText);
  };

  const { recordingState, handleRecordingToggle, clearError } =
    useVoiceTranscription({
      onTranscriptionComplete: handleTranscriptionComplete,
    });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      setSelectedImages((prev) => [...prev, ...imageFiles]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && selectedImages.length === 0) return;

    handleSubmit(e, selectedImages);
    setSelectedImages([]);
  };

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      sx={{
        p: 1.5,
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        bgcolor: "background.surface",
      }}
    >
      {/* نمایش عکس‌های انتخاب شده */}
      {selectedImages.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {selectedImages.map((file, index) => (
            <Chip
              key={index}
              variant="soft"
              color="primary"
              endDecorator={
                <IconButton
                  size="sm"
                  variant="plain"
                  onClick={() => removeImage(index)}
                  sx={{ ml: 0.5 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
              sx={{
                maxWidth: 200,
              }}
            >
              📷 {file.name.substring(0, 15)}
              {file.name.length > 15 ? "..." : ""}
            </Chip>
          ))}
        </Stack>
      )}

      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`${placeholder} ${
            isDesktop ? "(Enter برای ارسال، Shift+Enter برای خط جدید)" : ""
          }`}
          disabled={isLoading || recordingState.isTranscribing}
          minRows={1}
          maxRows={4}
          variant="soft"
          sx={{
            flex: 1,
            "--Textarea-focusedThickness": "2px",
            "--Textarea-focusedHighlight": "var(--joy-palette-primary-500)",
            transition: "all 0.2s ease",
          }}
        />

        {/* دکمه آپلود عکس */}
        <Tooltip title="افزودن عکس فاکتور">
          <span>
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              color="neutral"
              variant="soft"
              sx={{
                transition: "all 0.2s ease",
                "&:hover:not(:disabled)": { transform: "scale(1.05)" },
              }}
            >
              <ImageIcon />
            </IconButton>
          </span>
        </Tooltip>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />

        {/* دکمه ضبط صدا */}
        <VoiceRecordingButton
          recordingState={recordingState}
          onToggle={handleRecordingToggle}
          onClearError={clearError}
          disabled={isLoading}
        />

        {/* دکمه ارسال */}
        <Tooltip title={isLoading ? "در حال ارسال..." : "ارسال پیام"}>
          <span>
            <IconButton
              type="submit"
              disabled={
                isLoading ||
                (!input.trim() && selectedImages.length === 0) ||
                recordingState.isRecording ||
                recordingState.isTranscribing
              }
              color="primary"
              variant={
                input.trim() || selectedImages.length > 0 ? "solid" : "soft"
              }
              sx={{
                transform: "scaleX(-1)",
                transition: "all 0.2s ease",
                "&:hover:not(:disabled)": {
                  transform: "scaleX(-1) scale(1.05)",
                },
              }}
            >
              {isLoading ? <CircularProgress size="sm" /> : <SendIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}
