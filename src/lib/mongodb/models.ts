import { ObjectId } from "mongodb";
import { getDatabase } from "../mongodb";
import type { Transaction } from "../schemas/transactionSchema";

export interface TransactionDocument
  extends Omit<Transaction, "id" | "createdAt"> {
  _id: ObjectId;
  audioObjectName?: string;
  audioUrl?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TransactionModel {
  private static COLLECTION = "transactions";

  static async create(
    transaction: Omit<Transaction, "id">,
    audioObjectName?: string
  ): Promise<TransactionDocument> {
    const db = await getDatabase();
    const now = new Date();

    const doc: Omit<TransactionDocument, "_id"> = {
      type: transaction.type,
      counterparty: transaction.counterparty,
      date: transaction.date,
      items: transaction.items,
      totalAmount: transaction.totalAmount,
      description: transaction.description,
      status: transaction.status,
      transcriptionText: transaction.transcriptionText,
      audioObjectName,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection(this.COLLECTION).insertOne(doc);

    return {
      _id: result.insertedId,
      ...doc,
    } as TransactionDocument;
  }

  static async findById(id: string): Promise<TransactionDocument | null> {
    const db = await getDatabase();

    try {
      const doc = await db
        .collection<TransactionDocument>(this.COLLECTION)
        .findOne({ _id: new ObjectId(id) });

      return doc;
    } catch (error) {
      console.error("Invalid ObjectId:", error);
      return null;
    }
  }

  static async findAll(filters?: {
    status?: string;
    type?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    skip?: number;
  }): Promise<TransactionDocument[]> {
    const db = await getDatabase();
    const query: any = {};

    if (filters?.status) query.status = filters.status;
    if (filters?.type) query.type = filters.type;
    if (filters?.userId) query.userId = filters.userId;

    if (filters?.startDate || filters?.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }

    const cursor = db
      .collection<TransactionDocument>(this.COLLECTION)
      .find(query)
      .sort({ createdAt: -1 });

    if (filters?.limit) cursor.limit(filters.limit);
    if (filters?.skip) cursor.skip(filters.skip);

    return await cursor.toArray();
  }

  static async update(
    id: string,
    updates: Partial<Omit<Transaction, "id" | "createdAt">>
  ): Promise<TransactionDocument | null> {
    const db = await getDatabase();

    try {
      const result = await db
        .collection<TransactionDocument>(this.COLLECTION)
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          {
            $set: {
              ...updates,
              updatedAt: new Date(),
            },
          },
          { returnDocument: "after" }
        );

      return result || null;
    } catch (error) {
      console.error("Invalid ObjectId:", error);
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDatabase();

    try {
      const result = await db
        .collection(this.COLLECTION)
        .deleteOne({ _id: new ObjectId(id) });

      return result.deletedCount > 0;
    } catch (error) {
      console.error("Invalid ObjectId:", error);
      return false;
    }
  }

  static async getStats(userId?: string): Promise<{
    total: number;
    confirmed: number;
    pending: number;
    rejected: number;
    totalBuyAmount: number;
    totalSellAmount: number;
  }> {
    const db = await getDatabase();
    const query: any = userId ? { userId } : {};

    const pipeline = [
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          buyAmount: {
            $sum: {
              $cond: [{ $eq: ["$type", "buy"] }, "$totalAmount", 0],
            },
          },
          sellAmount: {
            $sum: {
              $cond: [{ $eq: ["$type", "sell"] }, "$totalAmount", 0],
            },
          },
        },
      },
    ];

    const results = await db
      .collection(this.COLLECTION)
      .aggregate(pipeline)
      .toArray();

    const stats = {
      total: 0,
      confirmed: 0,
      pending: 0,
      rejected: 0,
      totalBuyAmount: 0,
      totalSellAmount: 0,
    };

    results.forEach((r: any) => {
      stats.total += r.count;
      if (r._id === "confirmed") stats.confirmed = r.count;
      if (r._id === "pending") stats.pending = r.count;
      if (r._id === "rejected") stats.rejected = r.count;
      stats.totalBuyAmount += r.buyAmount || 0;
      stats.totalSellAmount += r.sellAmount || 0;
    });

    return stats;
  }

  static toTransaction(doc: TransactionDocument): Transaction {
    return {
      id: doc._id.toString(),
      type: doc.type,
      counterparty: doc.counterparty,
      date: doc.date,
      items: doc.items,
      totalAmount: doc.totalAmount,
      description: doc.description,
      status: doc.status,
      createdAt: doc.createdAt.toISOString(),
      transcriptionText: doc.transcriptionText,
    };
  }

  static fromTransaction(
    transaction: Omit<Transaction, "id">,
    audioObjectName?: string
  ): Omit<TransactionDocument, "_id"> {
    return {
      type: transaction.type,
      counterparty: transaction.counterparty,
      date: transaction.date,
      items: transaction.items,
      totalAmount: transaction.totalAmount,
      description: transaction.description,
      status: transaction.status,
      transcriptionText: transaction.transcriptionText,
      audioObjectName,
      createdAt: transaction.createdAt
        ? new Date(transaction.createdAt)
        : new Date(),
      updatedAt: new Date(),
    };
  }
}
