import { useState, useRef, useCallback } from "react";

interface RecordingState {
  isRecording: false;
  isTranscribing: false;
  error: null;
}

interface RecordingStateRecording {
  isRecording: true;
  isTranscribing: false;
  error: null;
}

interface RecordingStateTranscribing {
  isRecording: false;
  isTranscribing: true;
  error: null;
}

interface RecordingStateError {
  isRecording: false;
  isTranscribing: false;
  error: string;
}

export type RecordingStateType =
  | RecordingState
  | RecordingStateRecording
  | RecordingStateTranscribing
  | RecordingStateError;

interface UseVoiceTranscriptionOptions {
  onTranscriptionComplete: (text: string, audioBlob: Blob) => void;
  transcriptionEndpoint?: string;
}

export const useVoiceTranscription = ({
  onTranscriptionComplete,
  transcriptionEndpoint = "/f-api/transcribe",
}: UseVoiceTranscriptionOptions) => {
  const [recordingState, setRecordingState] = useState<RecordingStateType>({
    isRecording: false,
    isTranscribing: false,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setRecordingState({
        isRecording: false,
        isTranscribing: false,
        error: null,
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        transcribeAudio();
      };

      mediaRecorder.start(1000);
      setRecordingState({
        isRecording: true,
        isTranscribing: false,
        error: null,
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      setRecordingState({
        isRecording: false,
        isTranscribing: false,
        error: error instanceof Error ? error.message : "خطا در شروع ضبط صدا",
      });
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [recordingState.isRecording]);

  const transcribeAudio = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      setRecordingState({
        isRecording: false,
        isTranscribing: false,
        error: "هیچ صدایی ضبط نشده است",
      });
      return;
    }

    setRecordingState({
      isRecording: false,
      isTranscribing: true,
      error: null,
    });

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch(transcriptionEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.text && result.text.trim()) {
        onTranscriptionComplete(result.text.trim(), audioBlob);
        setRecordingState({
          isRecording: false,
          isTranscribing: false,
          error: null,
        });
      } else {
        setRecordingState({
          isRecording: false,
          isTranscribing: false,
          error: "متن قابل تشخیصی یافت نشد",
        });
      }
    } catch (error) {
      console.error("Transcription error:", error);
      setRecordingState({
        isRecording: false,
        isTranscribing: false,
        error:
          error instanceof Error ? error.message : "خطا در تبدیل گفتار به متن",
      });
    }
  }, [onTranscriptionComplete, transcriptionEndpoint]);

  const handleRecordingToggle = useCallback(() => {
    if (recordingState.isRecording) {
      stopRecording();
    } else if (!recordingState.isTranscribing) {
      startRecording();
    }
  }, [
    recordingState.isRecording,
    recordingState.isTranscribing,
    startRecording,
    stopRecording,
  ]);

  const clearError = useCallback(() => {
    setRecordingState({
      isRecording: false,
      isTranscribing: false,
      error: null,
    });
  }, []);

  return {
    recordingState,
    startRecording,
    stopRecording,
    handleRecordingToggle,
    clearError,
  };
};
