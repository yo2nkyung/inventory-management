import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type ProductFormData = {
  name: string;
  price: number;
  rating: number;
  stockQuantity: number;
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => Promise<void> | void;
};

const createInitialFormData = () => ({
  productId: v4(),
  name: "",
  price: "",
  rating: "",
  stockQuantity: "",
});

type ProductFormState = ReturnType<typeof createInitialFormData>;

const validateProductForm = (formData: ProductFormState) => {
  const errors: string[] = [];
  const trimmedName = formData.name.trim();
  const price = Number(formData.price);
  const rating = Number(formData.rating);
  const stockQuantity = Number(formData.stockQuantity);

  if (trimmedName === "") {
    errors.push("Product name is required.");
  }

  if (formData.price === "" || !Number.isFinite(price) || price < 0) {
    errors.push("Price must be a non-negative number.");
  }

  if (
    formData.rating === "" ||
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 5
  ) {
    errors.push("Rating must be a number between 0 and 5.");
  }

  if (
    formData.stockQuantity === "" ||
    !Number.isInteger(stockQuantity) ||
    stockQuantity < 0
  ) {
    errors.push("Stock quantity must be a non-negative integer.");
  }

  return {
    errors,
    product:
      errors.length === 0
        ? {
            name: trimmedName,
            price,
            rating,
            stockQuantity,
          }
        : null,
  };
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState(createInitialFormData);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setValidationErrors([]);
    setSubmitError("");
  };

  const handleClose = () => {
    setFormData(createInitialFormData());
    setValidationErrors([]);
    setSubmitError("");
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { errors, product } = validateProductForm(formData);

    if (errors.length > 0 || !product) {
      setValidationErrors(errors);
      return;
    }

    try {
      await onCreate(product);
    } catch {
      setSubmitError("Failed to create product. Please try again.");
      return;
    }

    handleClose();
  };




  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          {validationErrors.length > 0 && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <ul className="list-disc pl-5">
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {submitError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </div>
          )}
          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name
          </label>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} value={formData.name}
          className={inputCssStyles} required/>
          
          {/* PRODUCT PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Price
          </label>
          <input type="number" min="0" step="0.01" name="price" placeholder="Price" onChange={handleChange} value={formData.price}
          className={inputCssStyles} required/>

          {/* PRODUCT STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock Quantity
          </label>
          <input type="number" min="0" step="1" name="stockQuantity" placeholder="Stock Quantity" onChange={handleChange} value={formData.stockQuantity}
          className={inputCssStyles} required/>

          {/* PRODUCT RATING */}
          <label htmlFor="rating" className={labelCssStyles}>
            Rating
          </label>
          <input type="number" min="0" max="5" step="0.1" name="rating" placeholder="Rating" onChange={handleChange} value={formData.rating}
          className={inputCssStyles} required/>

          {/* CREATE ACTIONS */}
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Create</button>
          <button type="button" onClick={handleClose} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
