// Update src/app/page.tsx

"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/joy";
import GenericChatbot from "@/components/organism/chatbot/GenericChatbot";
import TransactionRecorder from "@/components/organism/TransactionRecorder";
import TransactionTable from "@/components/organism/TransactionTable";
import { chatConfig } from "./config";
import { Transaction } from "@/lib/schemas/transactionSchema";
import { toast } from "react-toastify";

type TransactionWithAudio = Transaction & { audioUrl?: string };

export default function HomePage() {
  const [transactions, setTransactions] = useState<TransactionWithAudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    rejected: 0,
  });

  // Load transactions from MongoDB
  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/f-api/transactions");

      if (!response.ok) {
        throw new Error("Failed to load transactions");
      }

      const data = await response.json();
      setTransactions(data.data || []);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("خطا در بارگذاری معاملات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const response = await fetch("/f-api/transactions/stats");

      if (!response.ok) {
        throw new Error("Failed to load stats");
      }

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadTransactions();
    loadStats();
  }, [loadTransactions, loadStats]);

  const handleTransactionExtracted = useCallback(
    (transaction: Transaction, transcriptionText: string, audioBlob: Blob) => {
      // Transaction is already saved in MongoDB, just update local state
      setTransactions((prev) => [transaction as TransactionWithAudio, ...prev]);
      loadStats();
      toast.success("معامله با موفقیت ثبت شد");
    },
    [loadStats]
  );

  const handleAcceptTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        const response = await fetch(`/f-api/transactions/${transaction.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transaction: { status: "confirmed" },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update transaction");
        }

        const data = await response.json();

        setTransactions((prev) =>
          prev.map((t) => (t.id === transaction.id ? data.data : t))
        );

        loadStats();
        toast.success("معامله تایید شد");
      } catch (error) {
        console.error("Error accepting transaction:", error);
        toast.error("خطا در تایید معامله");
      }
    },
    [loadStats]
  );

  const handleRejectTransaction = useCallback(
    async (transactionId: string) => {
      try {
        const response = await fetch(`/f-api/transactions/${transactionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transaction: { status: "rejected" },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update transaction");
        }

        const data = await response.json();

        setTransactions((prev) =>
          prev.map((t) => (t.id === transactionId ? data.data : t))
        );

        loadStats();
        toast.info("معامله رد شد");
      } catch (error) {
        console.error("Error rejecting transaction:", error);
        toast.error("خطا در رد معامله");
      }
    },
    [loadStats]
  );

  const handleEditTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        const response = await fetch(`/f-api/transactions/${transaction.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transaction }),
        });

        if (!response.ok) {
          throw new Error("Failed to update transaction");
        }

        const data = await response.json();

        setTransactions((prev) =>
          prev.map((t) => (t.id === transaction.id ? data.data : t))
        );

        toast.success("معامله بروزرسانی شد");
      } catch (error) {
        console.error("Error editing transaction:", error);
        toast.error("خطا در ویرایش معامله");
      }
    },
    []
  );

  const handleDeleteTransaction = useCallback(
    async (transactionId: string) => {
      if (!confirm("آیا از حذف این معامله مطمئن هستید؟")) {
        return;
      }

      try {
        const response = await fetch(`/f-api/transactions/${transactionId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete transaction");
        }

        setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
        loadStats();
        toast.success("معامله حذف شد");
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast.error("خطا در حذف معامله");
      }
    },
    [loadStats]
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size="lg" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        py: 3,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 1, sm: 2 },
          maxWidth: "1600px",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography
            level="h2"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            داشبورد تاجر یار
          </Typography>
          <Typography level="body-md" sx={{ color: "text.secondary" }}>
            مدیریت هوشمند معاملات شما با قدرت هوش مصنوعی
          </Typography>
        </Box>

        <Grid
          container
          spacing={2}
          sx={{
            minHeight: "calc(100vh - 300px)",
          }}
        >
          <Grid
            xs={12}
            sm={7}
            md={8}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack spacing={2}>
              <TransactionRecorder
                onTransactionExtracted={handleTransactionExtracted}
              />

              <TransactionTable
                transactions={transactions}
                onAccept={handleAcceptTransaction}
                onReject={handleRejectTransaction}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </Stack>
          </Grid>

          <Grid
            xs={12}
            sm={5}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                position: { sm: "sticky" },
                top: { sm: 80 },
              }}
            >
              <GenericChatbot
                config={chatConfig}
                context={{
                  transactions: transactions.filter(
                    (t) => t.status === "confirmed"
                  ),
                  pendingTransactions: transactions.filter(
                    (t) => t.status === "pending"
                  ),
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Stats Summary */}
        {transactions.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "background.surface",
                    borderRadius: "lg",
                    boxShadow: "sm",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    level="h3"
                    sx={{ fontWeight: 800, color: "primary.500" }}
                  >
                    {stats.total}
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    کل معاملات
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "background.surface",
                    borderRadius: "lg",
                    boxShadow: "sm",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    level="h3"
                    sx={{ fontWeight: 800, color: "success.500" }}
                  >
                    {stats.confirmed}
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    تایید شده
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "background.surface",
                    borderRadius: "lg",
                    boxShadow: "sm",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    level="h3"
                    sx={{ fontWeight: 800, color: "warning.500" }}
                  >
                    {stats.pending}
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    در انتظار
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "background.surface",
                    borderRadius: "lg",
                    boxShadow: "sm",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    level="h3"
                    sx={{ fontWeight: 800, color: "primary.500" }}
                  >
                    {new Intl.NumberFormat("fa-IR").format(
                      transactions
                        .filter((t) => t.status === "confirmed")
                        .reduce((sum, t) => sum + t.totalAmount, 0)
                    )}
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    مجموع تومان
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
