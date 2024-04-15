import { asyncMethodHandler } from "../utils/asyncMethodHandler.js";
import {Product} from "../models/products_models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const listProducts = asyncMethodHandler( async (req,res) => {
    const productsList = await Product.find();

    return res.status(200).json(new ApiResponse(200, {
        productsList 
    },"Details fetched successfully!!!"));
});


const addProduct = asyncMethodHandler( async (req,res) => {
    const {
                price,
                rating,
                title,
                description,
                category,
                image_Url,
                stock
            } = req.body;

           const newProduct= new Product({
                price: price,
                rating:rating,
                title,
                description,
                category,
                image_Url,
                stock
            });
            await newProduct.save();
    console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
    return res.status(200).json(new ApiResponse(200, {
        newProduct
    },"Details fetched successfully!!!"));
});

export {listProducts,addProduct}; 