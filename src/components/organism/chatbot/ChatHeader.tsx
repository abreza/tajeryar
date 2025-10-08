import { Box, Stack, Avatar, Typography, Tooltip, IconButton } from "@mui/joy";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { pulse } from "./animations";

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  isLoading: boolean;
  onClose: () => void;
  onReset: () => void;
}

export default function ChatHeader({
  title,
  subtitle,
  isLoading,
  onClose,
  onReset,
}: ChatHeaderProps) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.surface",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar
          variant="soft"
          color="primary"
          sx={{
            background:
              "linear-gradient(135deg, var(--joy-palette-primary-500), var(--joy-palette-primary-600))",
          }}
        >
          <SmartToyOutlinedIcon />
        </Avatar>
        <Stack spacing={0}>
          <Typography level="title-sm" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: isLoading ? "warning.solidBg" : "success.solidBg",
                animation: isLoading
                  ? `${pulse} 1s ease-in-out infinite`
                  : "none",
              }}
            />
            <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
              {isLoading ? "در حال پاسخ‌دهی…" : subtitle || "آنلاین"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Tooltip title="بستن چت">
          <IconButton size="sm" variant="plain" onClick={onClose}>
            <ExpandLessIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="شروع گفت‌وگوی جدید">
          <IconButton
            size="sm"
            variant="plain"
            onClick={onReset}
            disabled={isLoading}
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
