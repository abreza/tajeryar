"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";

interface MobileHeaderProps {
  onMenuClick: () => void;
  menuOpen: boolean;
}

export default function MobileHeader({
  onMenuClick,
  menuOpen,
}: MobileHeaderProps) {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "grey.200",
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ minHeight: "56px !important", px: 2 }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            color: "text.primary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
          <AccountBalanceIcon
            sx={{ color: "primary.main", fontSize: "1.5rem" }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "text.primary",
            }}
          >
            تاجر یار - دستیار مالی هوشمند
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
