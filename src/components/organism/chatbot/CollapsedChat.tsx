import { Sheet, Stack, Avatar, Typography, Box, IconButton } from "@mui/joy";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { pulse } from "./animations";

interface CollapsedChatProps {
  title: string;
  onClick: () => void;
}

export default function CollapsedChat({ title, onClick }: CollapsedChatProps) {
  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: "lg",
        width: "100%",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        bgcolor: "background.level1",
        boxShadow: "sm",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": { boxShadow: "md", transform: "translateY(-1px)" },
      }}
      onClick={onClick}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar variant="soft" color="primary" size="sm">
          <SmartToyOutlinedIcon />
        </Avatar>
        <Typography level="title-sm" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "success.solidBg",
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
        />
      </Stack>
      <IconButton size="sm" variant="plain">
        <ExpandMoreIcon />
      </IconButton>
    </Sheet>
  );
}
