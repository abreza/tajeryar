import { UIMessage } from "ai";

export interface ChatMessage extends UIMessage {
  timestamp?: Date;
  feedback?: "positive" | "negative" | null;
}

export interface ChatbotConfig {
  id: string;
  title: string;
  subtitle?: string;
  collapsedTitle: string;
  apiEndpoint: string;
  placeholder: string;
  initialMessages: UIMessage[];
  quickPrompts: QuickPromptSection[];
  supportsFeedback?: boolean;
  supportsReasoning?: boolean;
}

export interface QuickPromptSection {
  title: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "danger" | "neutral";
  prompts: string[];
}

export interface ChatbotProps {
  config: ChatbotConfig;
  context?: Record<string, any>;
  onMessageSent?: (message: string) => void;
  className?: string;
}
