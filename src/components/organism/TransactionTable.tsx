"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Sheet,
  Typography,
  IconButton,
  Chip,
  Stack,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  Input,
  Select,
  Option,
  Textarea,
} from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Transaction, TransactionItem } from "@/lib/schemas/transactionSchema";

interface TransactionTableProps {
  transactions: (Transaction & { audioUrl?: string })[];
  onAccept: (transaction: Transaction) => void;
  onReject: (transactionId: string) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

export default function TransactionTable({
  transactions,
  onAccept,
  onReject,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(
    new Set()
  );

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const statusOrder: Record<string, number> = {
        pending: 0,
        rejected: 1,
        confirmed: 2,
      };

      const orderA = statusOrder[a.status] ?? 3;
      const orderB = statusOrder[b.status] ?? 3;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });
  }, [transactions]);

  const toggleExpanded = (transactionId: string) => {
    setExpandedTransactions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

  const handleAcceptTransaction = (transaction: Transaction) => {
    onAccept(transaction);

    setExpandedTransactions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(transaction.id || "");
      return newSet;
    });
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction({ ...transaction });
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingTransaction) {
      onEdit(editingTransaction);
      setIsModalOpen(false);
      setEditingTransaction(null);
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof TransactionItem,
    value: any
  ) => {
    if (!editingTransaction) return;

    const updatedItems = [...editingTransaction.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === "quantity" || field === "unitPrice") {
      const item = updatedItems[index];
      item.totalPrice = item.quantity * item.unitPrice;
    }

    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    setEditingTransaction({
      ...editingTransaction,
      items: updatedItems,
      totalAmount,
    });
  };

  const handleAddItem = () => {
    if (!editingTransaction) return;

    const newItem: TransactionItem = {
      itemName: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      unit: "عدد",
    };

    setEditingTransaction({
      ...editingTransaction,
      items: [...editingTransaction.items, newItem],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (!editingTransaction || editingTransaction.items.length <= 1) return;

    const updatedItems = editingTransaction.items.filter((_, i) => i !== index);
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    setEditingTransaction({
      ...editingTransaction,
      items: updatedItems,
      totalAmount,
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const getTypeLabel = (type: "buy" | "sell") => {
    return type === "buy" ? "خرید" : "فروش";
  };

  const getTypeColor = (type: "buy" | "sell") => {
    return type === "buy" ? "success" : "warning";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "در انتظار تایید";
      case "confirmed":
        return "تایید شده";
      case "rejected":
        return "رد شده";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "neutral";
    }
  };

  const AudioPlayer = ({
    audioUrl,
    transactionId,
  }: {
    audioUrl: string;
    transactionId: string;
  }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
      if (!audioRef.current) return;

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setPlayingAudio(null);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        setPlayingAudio(transactionId);
      }
    };

    React.useEffect(() => {
      if (playingAudio !== transactionId && isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    }, [playingAudio, transactionId, isPlaying]);

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => {
            setIsPlaying(false);
            setPlayingAudio(null);
          }}
        />
        <IconButton
          size="sm"
          variant="soft"
          color="primary"
          onClick={togglePlay}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <Typography level="body-xs">
          {isPlaying ? "در حال پخش" : "پخش صدا"}
        </Typography>
      </Box>
    );
  };

  if (transactions.length === 0) {
    return (
      <Card variant="outlined" sx={{ boxShadow: "sm" }}>
        <CardContent>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography level="h2" sx={{ mb: 2, fontSize: "3rem" }}>
              📋
            </Typography>
            <Typography level="title-lg" sx={{ mb: 1, fontWeight: 600 }}>
              هیچ معامله‌ای ثبت نشده است
            </Typography>
            <Typography level="body-md" sx={{ color: "text.tertiary" }}>
              با ضبط صدای خود، اولین معامله را ثبت کنید
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography level="title-lg" sx={{ fontWeight: 700 }}>
            📊 معاملات ثبت شده
          </Typography>
          <Chip size="sm" variant="soft" color="primary">
            {transactions.length} معامله
          </Chip>
        </Stack>

        {sortedTransactions.map((transaction, idx) => {
          const transactionId = transaction.id || String(idx);
          const isExpanded =
            expandedTransactions.has(transactionId) ||
            transaction.status !== "confirmed";

          return (
            <Card
              key={transactionId}
              variant="outlined"
              sx={{
                boxShadow: "sm",
                transition: "all 0.2s",
                "&:hover": {
                  boxShadow: "md",
                  borderColor: "primary.300",
                },
              }}
            >
              <CardContent>
                <Stack spacing={isExpanded ? 2.5 : 0}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flexWrap="wrap"
                    gap={1.5}
                  >
                    <Stack spacing={1} sx={{ flex: 1, minWidth: 200 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="sm"
                          variant="soft"
                          color={getTypeColor(transaction.type)}
                        >
                          {getTypeLabel(transaction.type)}
                        </Chip>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={getStatusColor(transaction.status)}
                        >
                          {getStatusLabel(transaction.status)}
                        </Chip>
                      </Stack>
                      <Typography level="title-md" sx={{ fontWeight: 700 }}>
                        {transaction.counterparty}
                      </Typography>
                      <Typography
                        level="body-sm"
                        sx={{ color: "text.tertiary" }}
                      >
                        📅 {transaction.date}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          textAlign: "left",
                          px: 2,
                          py: 1,
                          bgcolor: "primary.50",
                          borderRadius: "md",
                        }}
                      >
                        <Typography
                          level="body-xs"
                          sx={{ color: "text.secondary" }}
                        >
                          مبلغ کل
                        </Typography>
                        <Typography
                          level="title-lg"
                          sx={{ fontWeight: 700, color: "primary.700" }}
                        >
                          {formatNumber(transaction.totalAmount)}{" "}
                          <Typography component="span" level="body-sm">
                            تومان
                          </Typography>
                        </Typography>
                      </Box>

                      {transaction.status === "confirmed" && (
                        <IconButton
                          size="sm"
                          variant="soft"
                          color="neutral"
                          onClick={() => toggleExpanded(transactionId)}
                        >
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>

                  {isExpanded && (
                    <>
                      <Box>
                        <Typography
                          level="body-sm"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: "text.secondary",
                          }}
                        >
                          🛒 اقلام معامله
                        </Typography>
                        <Sheet
                          variant="soft"
                          sx={{ p: 1.5, borderRadius: "md" }}
                        >
                          <Stack spacing={1}>
                            {transaction.items.map((item, i) => (
                              <Stack
                                key={i}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                  py: 0.5,
                                  borderBottom:
                                    i < transaction.items.length - 1
                                      ? "1px solid"
                                      : "none",
                                  borderColor: "divider",
                                }}
                              >
                                <Typography
                                  level="body-sm"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {item.itemName}
                                </Typography>
                                <Typography
                                  level="body-sm"
                                  sx={{ color: "text.secondary" }}
                                >
                                  {formatNumber(item.quantity)} {item.unit} ×{" "}
                                  {formatNumber(item.unitPrice)} ={" "}
                                  {formatNumber(item.totalPrice)} تومان
                                </Typography>
                              </Stack>
                            ))}
                          </Stack>
                        </Sheet>
                      </Box>

                      {(transaction.audioUrl ||
                        transaction.transcriptionText) && (
                        <Box>
                          <Typography
                            level="body-sm"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              color: "text.secondary",
                            }}
                          >
                            🎙️ صدا و متن
                          </Typography>
                          <Sheet
                            variant="soft"
                            sx={{ p: 1.5, borderRadius: "md" }}
                          >
                            <Stack spacing={1.5}>
                              {transaction.audioUrl && (
                                <AudioPlayer
                                  audioUrl={transaction.audioUrl}
                                  transactionId={transactionId}
                                />
                              )}
                              {transaction.transcriptionText && (
                                <Box
                                  sx={{
                                    pt: transaction.audioUrl ? 1.5 : 0,
                                    borderTop: transaction.audioUrl
                                      ? "1px solid"
                                      : "none",
                                    borderColor: "divider",
                                  }}
                                >
                                  <Typography
                                    level="body-xs"
                                    sx={{
                                      fontWeight: 600,
                                      mb: 0.5,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <RecordVoiceOverIcon fontSize="small" />
                                    متن صوت ضبط شده
                                  </Typography>
                                  <Typography
                                    level="body-sm"
                                    sx={{
                                      fontStyle: "italic",
                                      color: "text.secondary",
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    {transaction.transcriptionText}
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Sheet>
                        </Box>
                      )}

                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                        flexWrap="wrap"
                        sx={{ pt: 0.5 }}
                      >
                        {transaction.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="soft"
                              color="success"
                              startDecorator={<CheckCircleIcon />}
                              onClick={() =>
                                handleAcceptTransaction(transaction)
                              }
                            >
                              تایید
                            </Button>
                            <Button
                              size="sm"
                              variant="soft"
                              color="danger"
                              startDecorator={<CancelIcon />}
                              onClick={() => onReject(transactionId)}
                            >
                              رد
                            </Button>
                          </>
                        )}
                        {transaction.status === "rejected" && (
                          <Button
                            size="sm"
                            variant="soft"
                            color="danger"
                            startDecorator={<DeleteIcon />}
                            onClick={() => onDelete?.(transactionId)}
                          >
                            حذف
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="soft"
                          color="primary"
                          startDecorator={<EditIcon />}
                          onClick={() => handleEditClick(transaction)}
                        >
                          ویرایش
                        </Button>
                      </Stack>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalDialog
          sx={{
            maxWidth: { xs: "95vw", sm: 700 },
            maxHeight: { xs: "95vh", sm: "90vh" },
            width: "100%",
            overflow: "auto",
            m: { xs: 1, sm: 2 },
          }}
        >
          <ModalClose />
          <Typography level="title-lg" sx={{ mb: 2 }}>
            ویرایش معامله
          </Typography>

          {editingTransaction && (
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography level="body-sm" sx={{ mb: 0.5 }}>
                    نوع معامله
                  </Typography>
                  <Select
                    value={editingTransaction.type}
                    onChange={(_, value) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        type: value as "buy" | "sell",
                      })
                    }
                    sx={{ width: "100%" }}
                  >
                    <Option value="buy">خرید</Option>
                    <Option value="sell">فروش</Option>
                  </Select>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography level="body-sm" sx={{ mb: 0.5 }}>
                    تاریخ
                  </Typography>
                  <Input
                    value={editingTransaction.date}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        date: e.target.value,
                      })
                    }
                    placeholder="YYYY/MM/DD"
                  />
                </Box>
              </Stack>

              <Box>
                <Typography level="body-sm" sx={{ mb: 0.5 }}>
                  طرف معامله
                </Typography>
                <Input
                  value={editingTransaction.counterparty}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      counterparty: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                    اقلام
                  </Typography>
                  <Button
                    size="sm"
                    variant="soft"
                    color="primary"
                    startDecorator={<AddIcon />}
                    onClick={handleAddItem}
                  >
                    افزودن
                  </Button>
                </Stack>

                <Stack spacing={2}>
                  {editingTransaction.items.map((item, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        <Stack spacing={1.5}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                          >
                            <Input
                              sx={{ flex: { xs: 1, sm: 2 } }}
                              placeholder="نام کالا"
                              value={item.itemName}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "itemName",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              sx={{ flex: 1 }}
                              type="number"
                              placeholder="تعداد"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "quantity",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </Stack>

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                          >
                            <Input
                              sx={{ flex: 1 }}
                              placeholder="واحد"
                              value={item.unit}
                              onChange={(e) =>
                                handleItemChange(index, "unit", e.target.value)
                              }
                            />
                            <Input
                              sx={{ flex: 1 }}
                              type="number"
                              placeholder="قیمت واحد"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                            <Input
                              sx={{ flex: 1 }}
                              disabled
                              value={formatNumber(item.totalPrice)}
                              placeholder="قیمت کل"
                            />
                          </Stack>

                          {editingTransaction.items.length > 1 && (
                            <Button
                              size="sm"
                              variant="soft"
                              color="danger"
                              startDecorator={<DeleteIcon />}
                              onClick={() => handleRemoveItem(index)}
                              sx={{ alignSelf: "flex-start" }}
                            >
                              حذف
                            </Button>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography level="body-sm" sx={{ mb: 0.5 }}>
                  توضیحات
                </Typography>
                <Textarea
                  minRows={2}
                  value={editingTransaction.description || ""}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      description: e.target.value,
                    })
                  }
                  placeholder="توضیحات اختیاری..."
                />
              </Box>

              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.level1",
                  borderRadius: "sm",
                }}
              >
                <Typography level="title-md" sx={{ fontWeight: 700 }}>
                  💰 مبلغ کل: {formatNumber(editingTransaction.totalAmount)}{" "}
                  تومان
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                spacing={1}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => setIsModalOpen(false)}
                >
                  انصراف
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={handleSaveEdit}
                >
                  ذخیره تغییرات
                </Button>
              </Stack>
            </Stack>
          )}
        </ModalDialog>
      </Modal>
    </>
  );
}
