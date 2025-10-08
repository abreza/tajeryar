"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  useTheme,
} from "@mui/joy";
import {
  AccountBalance as AccountBalanceIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  AttachMoney as AttachMoneyIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
// eslint-disable-next-line no-restricted-imports
import { useMediaQuery } from "@mui/material";
import Link from "next/link";

const navItems = [
  { label: "صفحه اصلی", href: "/", icon: <HomeIcon /> },
  { label: "درباره ما", href: "/about", icon: <InfoIcon /> },
  { label: "قیمت‌گذاری", href: "/pricing", icon: <AttachMoneyIcon /> },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        bgcolor: "background.surface",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "sm",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ py: 1.5, px: { xs: 1, sm: 2 } }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <AccountBalanceIcon
                sx={{
                  fontSize: 32,
                  color: "primary.500",
                }}
              />
              <Box>
                <Typography
                  level="h4"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1,
                  }}
                >
                  تاجر یار
                </Typography>
                <Typography
                  level="body-xs"
                  sx={{ color: "text.tertiary", mt: 0.25 }}
                >
                  دستیار مالی هوشمند
                </Typography>
              </Box>
            </Stack>
          </Link>

          {!isMobile && (
            <Stack direction="row" spacing={2} alignItems="center">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="plain"
                    color="neutral"
                    startDecorator={item.icon}
                    sx={{
                      fontWeight: 500,
                      "&:hover": {
                        bgcolor: "primary.softBg",
                        color: "primary.solidColor",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Link href="/" style={{ textDecoration: "none" }}>
                <Button variant="solid" color="primary">
                  شروع کنید
                </Button>
              </Link>
            </Stack>
          )}

          {isMobile && (
            <IconButton
              variant="outlined"
              color="neutral"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Stack>
      </Container>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccountBalanceIcon sx={{ color: "primary.500" }} />
              <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                تاجر یار
              </Typography>
            </Stack>
            <IconButton size="sm" onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <List>
            {navItems.map((item) => (
              <ListItem key={item.href}>
                <Link
                  href={item.href}
                  style={{ textDecoration: "none", width: "100%" }}
                  onClick={handleDrawerToggle}
                >
                  <ListItemButton>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {item.icon}
                      <Typography>{item.label}</Typography>
                    </Stack>
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 3 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                fullWidth
                variant="solid"
                color="primary"
                onClick={handleDrawerToggle}
              >
                شروع کنید
              </Button>
            </Link>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
