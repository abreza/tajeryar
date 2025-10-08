import { Box, Stack, Divider, Avatar, Typography, Chip } from "@mui/joy";
import { QuickPromptSection } from "./types";
import { fadeInUp } from "./animations";

interface QuickPromptsProps {
  sections: QuickPromptSection[];
  onPromptClick: (prompt: string) => void;
}

export default function QuickPrompts({
  sections,
  onPromptClick,
}: QuickPromptsProps) {
  if (!sections.length) return null;

  return (
    <Box
      sx={{
        alignSelf: "center",
        width: "100%",
        maxWidth: 520,
        mt: 1,
        animation: `${fadeInUp} 0.5s ease-out`,
      }}
    >
      <Divider sx={{ mb: 2 }}>سوالات پرکاربرد</Divider>
      <Stack spacing={2}>
        {sections.map((section, index) => (
          <Box key={index}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <Avatar variant="soft" color={section.color} size="sm">
                {section.icon}
              </Avatar>
              <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                {section.title}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              justifyContent="center"
            >
              {section.prompts.map((prompt) => (
                <Chip
                  key={prompt}
                  variant="soft"
                  color={section.color}
                  onClick={() => onPromptClick(prompt)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "sm",
                    },
                  }}
                >
                  {prompt}
                </Chip>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
