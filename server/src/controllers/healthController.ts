import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getHealth = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const timestamp = new Date().toISOString();

  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp,
    });
  } catch (error) {
    console.error("GET /health error:", error);
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      timestamp,
    });
  }
};
