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
                price,
                rating,
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

const fetchProductById = asyncMethodHandler(async(req,res)=>{
    // const {productID} = req.body;
    const {productID} = req.params;
    console.log(productID);
    const productDetails = await Product.findById(productID);
    return res.status(200).json(new ApiResponse(200,{productDetails},"Fetched products details successfully!!!"));
});

export {listProducts,addProduct,fetchProductById}; 