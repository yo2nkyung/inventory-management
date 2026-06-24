import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getExpenseByCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany(
      {
        orderBy: {
          date: "desc",
        }
      }
    );
    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item: (typeof expenseByCategorySummaryRaw)[number]) => ({
        ...item,
        amount: item.amount.toString(),
      })
    );

    res.json(expenseByCategorySummary);
  } catch (error) {
    console.error("expense error:", error);
    res.status(500).json({ message: "Error retreiving expenses by category" });
  }
};
