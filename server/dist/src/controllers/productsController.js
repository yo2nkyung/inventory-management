"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getProducts = void 0;
const prisma_1 = require("../lib/prisma");
const validateProductInput = (body) => {
    const errors = [];
    const { productId, name, price, rating, stockQuantity, } = body;
    if (typeof productId !== "string" || productId.trim() === "") {
        errors.push("productId must be a non-empty string");
    }
    if (typeof name !== "string" || name.trim() === "") {
        errors.push("name must be a non-empty string");
    }
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
        errors.push("price must be a non-negative number");
    }
    if (rating !== undefined &&
        rating !== null &&
        (typeof rating !== "number" || !Number.isFinite(rating) || rating < 0 || rating > 5)) {
        errors.push("rating must be a number between 0 and 5");
    }
    if (typeof stockQuantity !== "number" ||
        !Number.isInteger(stockQuantity) ||
        stockQuantity < 0) {
        errors.push("stockQuantity must be a non-negative integer");
    }
    return {
        errors,
        product: errors.length === 0
            ? {
                productId,
                name,
                price,
                rating,
                stockQuantity,
            }
            : null,
    };
};
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const products = yield prisma_1.prisma.products.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        });
        res.json(products);
    }
    catch (_b) {
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { errors, product: validatedProduct } = validateProductInput(req.body);
        if (errors.length > 0 || !validatedProduct) {
            res.status(400).json({
                message: "Invalid product input",
                errors,
            });
            return;
        }
        const product = yield prisma_1.prisma.products.create({
            data: validatedProduct,
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error("POST /products error:", error);
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
