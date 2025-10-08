import React from "react";
import { IconButton, Tooltip, CircularProgress } from "@mui/joy";
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Stop as StopIcon,
} from "@mui/icons-material";
import { RecordingStateType } from "../../hooks/useVoiceTranscription";

interface VoiceRecordingButtonProps {
  recordingState: RecordingStateType;
  onToggle: () => void;
  onClearError: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const VoiceRecordingButton: React.FC<VoiceRecordingButtonProps> = ({
  recordingState,
  onToggle,
  onClearError,
  disabled = false,
  size = "md",
}) => {
  const getButtonContent = () => {
    if (recordingState.isTranscribing) {
      return <CircularProgress size="sm" />;
    }
    if (recordingState.isRecording) {
      return <StopIcon />;
    }
    if (recordingState.error) {
      return <MicOffIcon />;
    }
    return <MicIcon />;
  };

  const getTooltip = () => {
    if (recordingState.isTranscribing) {
      return "در حال تبدیل گفتار به متن...";
    }
    if (recordingState.isRecording) {
      return "توقف ضبط صدا";
    }
    if (recordingState.error) {
      return `خطا: ${recordingState.error}`;
    }
    return "ضبط صدا";
  };

  const getButtonColor = () => {
    if (recordingState.error) return "danger";
    if (recordingState.isRecording) return "warning";
    if (recordingState.isTranscribing) return "primary";
    return "neutral";
  };

  const handleClick = () => {
    if (recordingState.error) {
      onClearError();
    } else {
      onToggle();
    }
  };

  return (
    <Tooltip title={getTooltip()}>
      <span>
        <IconButton
          onClick={handleClick}
          disabled={disabled}
          color={getButtonColor()}
          variant={
            recordingState.isRecording || recordingState.isTranscribing
              ? "solid"
              : "soft"
          }
          size={size}
          sx={{
            transition: "all 0.2s ease",
            "&:hover:not(:disabled)": { transform: "scale(1.05)" },
            ...(recordingState.isRecording && {
              animation: "pulse 1.5s ease-in-out infinite",
              "@keyframes pulse": {
                "0%": { opacity: 1, transform: "scale(1)" },
                "50%": { opacity: 0.8, transform: "scale(1.05)" },
                "100%": { opacity: 1, transform: "scale(1)" },
              },
            }),
          }}
        >
          {getButtonContent()}
        </IconButton>
      </span>
    </Tooltip>
  );
};

