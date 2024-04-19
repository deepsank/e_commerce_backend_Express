import { Order,orderStatusEnum } from "../models/order_models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncMethodHandler } from "../utils/asyncMethodHandler.js";

const paymentMethod = function(req,res){
    
    return true;  // Mocking success payments
}
const fetchUserDetailsFromOrderId = async function(orderId){
    const order = await Order.findById(orderId)
    .populate('userId') // Populate the `user` field with details from the User model
    .exec();
    // if (err) {
    //     throw new ApiError(400,"Some error occured while fetching order details for the user!!!");
    // }
    // if (!order) {
    //     throw new ApiError(400,"Some error occured while fetching order details for the user!!!");
    // }
    // Access the populated user details
    return order; 
}


const placeOrder = asyncMethodHandler( async(req,res)=>{
    const {totalPrice,items,address} = req.body;

    const user = req.user;

    const newOrder = await Order.create({
        userId : user._id,
        totalPrice,
        address,
        items

    });

    const isPaymentSuccess =  paymentMethod();
    console.log(isPaymentSuccess);

    if(isPaymentSuccess){
        newOrder.status = orderStatusEnum.DELIVERED;
        const savedOrder = await newOrder.save();

        const orderDetails = await fetchUserDetailsFromOrderId(savedOrder._id);
        return res.status(201).json(new ApiResponse(201,{orderDetails}, "The order has been placed successfully!!!"));
    }
    else{
        return res.status(201).json(new ApiError(201,"", ["Placing the order failed,please try again!!!"]));
    }
    

});

const fetchOrderById = asyncMethodHandler(async(req,res)=>{
    const {orderId} = req.params;
    const orderDetails = await Order.findById({_id:orderId});
  if(!orderDetails){
    return res.status(400).json(new ApiError(400,"",["No orders placed till now!!!"]));
  }
  return res.status(200).json(new ApiResponse(200,{orderDetails},"Fetched orders for the user successfully!!!"));
});

export { placeOrder,fetchOrderById};