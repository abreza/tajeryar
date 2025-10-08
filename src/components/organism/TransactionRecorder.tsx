"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  LinearProgress,
  Chip,
  Sheet,
  Divider,
} from "@mui/joy";
import { useVoiceTranscription } from "@/hooks/useVoiceTranscription";
import { VoiceRecordingButton } from "../atom/VoiceRecordingButton";
import MicIcon from "@mui/icons-material/Mic";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Transaction } from "@/lib/schemas/transactionSchema";
import { keyframes } from "@mui/system";

async function uploadAudioToMinio(
  audioBlob: Blob,
  transactionId: string
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append(
      "file",
      audioBlob,
      `transaction-${transactionId}-${Date.now()}.webm`
    );
    formData.append("path", "transactions");

    const response = await fetch("/f-api/minio/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload audio");
    }

    const data = await response.json();
    return data.data.objectName;
  } catch (error) {
    console.error("Error uploading audio to MinIO:", error);
    return null;
  }
}

interface TransactionRecorderProps {
  onTransactionExtracted: (
    transaction: Transaction,
    transcriptionText: string,
    audioBlob: Blob
  ) => void;
}

const waveAnimation = keyframes`
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const successPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 20px 10px rgba(76, 175, 80, 0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

export default function TransactionRecorder({
  onTransactionExtracted,
}: TransactionRecorderProps) {
  const [transcriptionText, setTranscriptionText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");

  const handleTranscriptionComplete = async (text: string, audioBlob: Blob) => {
    setTranscriptionText(text);
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setProcessingStep("استخراج اطلاعات");

    try {
      const extractResponse = await fetch("/f-api/extract-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription: text }),
      });

      if (!extractResponse.ok) {
        throw new Error("خطا در استخراج اطلاعات معامله");
      }

      const extractData = await extractResponse.json();

      if (extractData.error) {
        throw new Error(extractData.error);
      }

      setProcessingStep("آپلود فایل صوتی");

      const audioObjectName = await uploadAudioToMinio(
        audioBlob,
        extractData.transaction.id
      );

      setProcessingStep("ذخیره در پایگاه داده");

      const saveResponse = await fetch("/f-api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction: {
            ...extractData.transaction,
            transcriptionText: text,
          },
          audioObjectName,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("خطا در ذخیره معامله");
      }

      const savedData = await saveResponse.json();

      onTransactionExtracted(savedData.data, text, audioBlob);
      setSuccess(true);
      setProcessingStep("");

      setTimeout(() => {
        setTranscriptionText("");
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص");
      setProcessingStep("");
    } finally {
      setIsProcessing(false);
    }
  };

  const { recordingState, handleRecordingToggle, clearError } =
    useVoiceTranscription({
      onTranscriptionComplete: handleTranscriptionComplete,
    });

  const WaveformBars = () => (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      justifyContent="center"
      sx={{ height: 40 }}
    >
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 4,
            height: "100%",
            bgcolor: "white",
            borderRadius: "sm",
            animation: `${waveAnimation} 1s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
            opacity: 0.8,
          }}
        />
      ))}
    </Stack>
  );

  const getCurrentState = () => {
    if (success) return "success";
    if (error || recordingState.error) return "error";
    if (isProcessing) return "processing";
    if (recordingState.isTranscribing) return "transcribing";
    if (recordingState.isRecording) return "recording";
    return "idle";
  };

  const currentState = getCurrentState();

  return (
    <Card
      variant="outlined"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        boxShadow: "lg",
        overflow: "hidden",
        position: "relative",
        "&::before":
          currentState === "recording"
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                backgroundSize: "1000px 100%",
                animation: `${shimmer} 3s infinite`,
              }
            : {},
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                p: 1,
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: "md",
                display: "flex",
              }}
            >
              <MicIcon sx={{ fontSize: 28 }} />
            </Box>
            <Stack spacing={0.5}>
              <Typography
                level="title-lg"
                sx={{ fontWeight: 700, color: "white" }}
              >
                ثبت معامله صوتی
              </Typography>
              <Typography
                level="body-xs"
                sx={{ color: "rgba(255,255,255,0.8)" }}
              >
                سریع، آسان و هوشمند
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

          {/* Main Recording Area */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 2,
            }}
          >
            {/* Recording Button */}
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Pulsing rings for recording state */}
              {currentState === "recording" && (
                <>
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        position: "absolute",
                        width: 80 + i * 30,
                        height: 80 + i * 30,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        animation: `${successPulse} 2s ease-out infinite`,
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  ))}
                </>
              )}

              <VoiceRecordingButton
                recordingState={recordingState}
                onToggle={handleRecordingToggle}
                onClearError={clearError}
                disabled={isProcessing}
                size="lg"
              />
            </Box>

            {/* State Indicator */}
            <Sheet
              variant="soft"
              sx={{
                px: 2,
                py: 1,
                borderRadius: "md",
                bgcolor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                minWidth: 200,
                textAlign: "center",
                animation: `${slideInUp} 0.3s ease-out`,
              }}
            >
              {currentState === "idle" && (
                <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                  برای شروع روی دکمه کلیک کنید
                </Typography>
              )}
              {currentState === "recording" && (
                <Stack spacing={1} alignItems="center">
                  <WaveformBars />
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <GraphicEqIcon sx={{ fontSize: 18 }} />
                    <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                      در حال ضبط صدا...
                    </Typography>
                  </Stack>
                </Stack>
              )}
              {currentState === "transcribing" && (
                <Stack spacing={1} alignItems="center">
                  <LinearProgress
                    sx={{
                      width: "100%",
                      bgcolor: "rgba(255,255,255,0.2)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "white",
                      },
                    }}
                  />
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    🎯 تبدیل گفتار به متن...
                  </Typography>
                </Stack>
              )}
              {currentState === "processing" && (
                <Stack spacing={1} alignItems="center">
                  <LinearProgress
                    sx={{
                      width: "100%",
                      bgcolor: "rgba(255,255,255,0.2)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "white",
                      },
                    }}
                  />
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                    <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                      {processingStep}...
                    </Typography>
                  </Stack>
                </Stack>
              )}
              {currentState === "success" && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  justifyContent="center"
                  sx={{
                    animation: `${successPulse} 1s ease-out`,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 20, color: "#4caf50" }} />
                  <Typography level="body-sm" sx={{ fontWeight: 700 }}>
                    ✨ معامله ثبت شد!
                  </Typography>
                </Stack>
              )}
              {currentState === "error" && (
                <Typography
                  level="body-sm"
                  sx={{ fontWeight: 600, color: "#ff5252" }}
                >
                  ❌ {error || recordingState.error}
                </Typography>
              )}
            </Sheet>
          </Box>

          {/* Transcription Display */}
          {transcriptionText && !success && (
            <Sheet
              variant="soft"
              sx={{
                p: 2,
                borderRadius: "md",
                bgcolor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                animation: `${slideInUp} 0.3s ease-out`,
              }}
            >
              <Stack spacing={1}>
                <Typography
                  level="body-xs"
                  sx={{ fontWeight: 700, color: "rgba(255,255,255,0.9)" }}
                >
                  📝 متن ضبط شده:
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{
                    color: "white",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  {transcriptionText}
                </Typography>
              </Stack>
            </Sheet>
          )}

          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <TipsAndUpdatesIcon sx={{ fontSize: 20 }} />
              <Typography
                level="body-xs"
                sx={{ fontWeight: 700, color: "rgba(255,255,255,0.9)" }}
              >
                نکات مهم:
              </Typography>
            </Stack>
            <Stack spacing={1}>
              <Chip
                size="sm"
                variant="soft"
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  justifyContent: "flex-start",
                  "--Chip-paddingInline": "12px",
                }}
              >
                نام طرف معامله + تعداد + نوع کالا + قیمت را ذکر کنید
              </Chip>
              <Chip
                size="sm"
                variant="soft"
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  justifyContent: "flex-start",
                  "--Chip-paddingInline": "12px",
                }}
              >
                💡 مثال: از آقای رضایی 10 کیلو برنج به قیمت هر کیلو 50 هزار
                تومان خریدم
              </Chip>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
