import mongoose from "mongoose";

// Define the enum for order status
const orderStatusEnum = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
};

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId, // Function to generate a new ObjectId
    },
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    totalPrice: {
      type: Number,
      min: 0, // Minimum value for the price
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(orderStatusEnum), // Allow only values defined in the enum
      default: orderStatusEnum.PENDING, // Default status is 'pending'
    },
    items: [
      {
        productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
