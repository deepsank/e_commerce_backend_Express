import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId // Function to generate a new ObjectId
    },
    name : {
        type : String,
        required : true,

    },
    description : {
        type : String,
        required : true,

    },
    price: {
        type: Number,
        min: 0, // Minimum value for the price
        required: [true, 'Price is required']
    },
    stock: {
        type: Number,
        min: 0, // Minimum value for the stock
        required: [true, 'Stock is required']
    },
    category: {
        type : String,
        required : true,

    },
    image_Url: {
        type : String,
        required : true,

    },
},{ timestamps: true});

export const Product = mongoose.model("Product",productSchema);