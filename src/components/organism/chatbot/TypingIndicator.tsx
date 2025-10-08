import { Box, Sheet, Stack, Avatar } from "@mui/joy";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { fadeInUp, typingDots } from "./animations";

export default function TypingIndicator() {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignSelf: "flex-start", animation: `${fadeInUp} 0.3s ease-out` }}
    >
      <Avatar variant="soft" color="neutral" size="sm">
        <SmartToyOutlinedIcon fontSize="small" />
      </Avatar>
      <Sheet
        variant="soft"
        color="neutral"
        sx={{
          p: 1.5,
          borderRadius: "lg",
          boxShadow: "sm",
          minWidth: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "neutral.solidBg",
                animation: `${typingDots} 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </Stack>
      </Sheet>
    </Stack>
  );
}
