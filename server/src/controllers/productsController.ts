import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

type ValidatedProductInput = {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
};

const validateProductInput = (body: Request["body"]) => {
  const errors: string[] = [];
  const {
    productId,
    name,
    price,
    rating,
    stockQuantity,
  } = body as Record<string, unknown>;

  if (typeof productId !== "string" || productId.trim() === "") {
    errors.push("productId must be a non-empty string");
  }

  if (typeof name !== "string" || name.trim() === "") {
    errors.push("name must be a non-empty string");
  }

  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    errors.push("price must be a non-negative number");
  }

  if (
    rating !== undefined &&
    rating !== null &&
    (typeof rating !== "number" || !Number.isFinite(rating) || rating < 0 || rating > 5)
  ) {
    errors.push("rating must be a number between 0 and 5");
  }

  if (
    typeof stockQuantity !== "number" ||
    !Number.isInteger(stockQuantity) ||
    stockQuantity < 0
  ) {
    errors.push("stockQuantity must be a non-negative integer");
  }

  return {
    errors,
    product:
      errors.length === 0
        ? ({
            productId,
            name,
            price,
            rating,
            stockQuantity,
          } as ValidatedProductInput)
        : null,
  };
};

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    res.json(products);
  } catch {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { errors, product: validatedProduct } = validateProductInput(req.body);

    if (errors.length > 0 || !validatedProduct) {
      res.status(400).json({
        message: "Invalid product input",
        errors,
      });
      return;
    }

    const product = await prisma.products.create({
      data: validatedProduct,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("POST /products error:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};
