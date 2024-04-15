import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  rating: mongoose.Types.Decimal128,
  count: Number,
});


const productSchema = new mongoose.Schema(
  {
    productId: {
      // type: mongoose.Schema.Types.ObjectId,
      // default: mongoose.Types.ObjectId // Function to generate a new ObjectId
      type: Number,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
        type :mongoose.Types.Decimal128
    },
    stock: {
      type: Number,
      min: 0, // Minimum value for the stock
      required: [true, "Stock is required"],
    },
    category: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Category",
      required: true,
    },
    image_Url: {
      type: String,
      required: true,
    },
    rating: {
       ratingSchema,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
