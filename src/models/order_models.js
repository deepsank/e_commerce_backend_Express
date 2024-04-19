import mongoose from "mongoose";

// Define the enum for order status
const orderStatusEnum = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  FAILED: "failed"
};

const orderSchema = new mongoose.Schema(
  {
    // orderId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   default: mongoose.Types.ObjectId, // Function to generate a new ObjectId
    // },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // unique: true,
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
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        // ratingsForTheOrder  ------------ we can user it for storing the ratings for the order later on
      },
    ],
    address: {
      street:{
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pinCode: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

 const Order = mongoose.model("Order", orderSchema);

 export {Order,orderStatusEnum};