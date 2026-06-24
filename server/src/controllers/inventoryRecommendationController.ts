import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getInventoryRecommendations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const analysisWindowDays = Math.max(
      1,
      parseInt(req.query.days?.toString() ?? "30", 10),
    );
    const windowStart = new Date();
    windowStart.setDate(windowStart.getDate() - analysisWindowDays);

    const products = await prisma.products.findMany({
      include: {
        Sales: {
          where: { timestamp: { gte: windowStart } },
          select: { quantity: true },
        },
      },
    });

    type Urgency = "critical" | "warning";

    const recommendations: {
      productId: string;
      productName: string;
      currentStock: number;
      avgDailyConsumption: number;
      daysUntilStockout: number;
      recommendedReorderQty: number;
      urgency: Urgency;
    }[] = [];

    for (const product of products) {
      const totalSold = product.Sales.reduce(
        (sum: number, sale: { quantity: number }) => sum + sale.quantity,
        0,
      );
      const avgDailyConsumption = totalSold / analysisWindowDays;

      if (avgDailyConsumption === 0) {
        if (product.stockQuantity === 0) {
          recommendations.push({
            productId: product.productId,
            productName: product.name,
            currentStock: 0,
            avgDailyConsumption: 0,
            daysUntilStockout: 0,
            recommendedReorderQty: 1,
            urgency: "critical",
          });
        }
        continue;
      }

      const daysUntilStockout = Math.floor(
        product.stockQuantity / avgDailyConsumption,
      );

      if (daysUntilStockout > 7) continue;

      recommendations.push({
        productId: product.productId,
        productName: product.name,
        currentStock: product.stockQuantity,
        avgDailyConsumption: Math.round(avgDailyConsumption * 100) / 100,
        daysUntilStockout,
        recommendedReorderQty: Math.ceil(avgDailyConsumption * 30),
        urgency: daysUntilStockout <= 3 ? "critical" : "warning",
      });
    }

    recommendations.sort((a, b) => {
      if (a.urgency !== b.urgency) return a.urgency === "critical" ? -1 : 1;
      return a.daysUntilStockout - b.daysUntilStockout;
    });

    res.json({
      generatedAt: new Date().toISOString(),
      analysisWindowDays,
      recommendations,
    });
  } catch (error) {
    console.error("inventory recommendation error:", error);
    res.status(500).json({ message: "Error generating inventory recommendations" });
  }
};
