import {asyncMethodHandler} from "../utils/asyncMethodHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User } from "../models/users_models.js";

const registerUser = asyncMethodHandler( async (req,res) => {

    //1.Get the user details
    //2.Validate the details entered -- not empty etc. etc.
    //3.See if users already exists with that username or email,.. if yes then return error
    //4.Upload profile photo to local and cloudinary
    //5.Once successfully uploaded on cloudinary, then remove from the local server
    //6.Create and Insert the user object in the DB
    //7.verify that users details got stored in the DB
    //8.remove fields like password and refereshToken before sending the userDetails as response to the Client
    //9.Return the response

    const {fullName, userId, email, password, mobileNumber } = req.body;

    if(
        [ fullName, userId, email, password, mobileNumber].some((key) => {
            return key?.trim() === "";
        }) 
    ){
        throw new ApiError(400,"All fields are mandatory, you have missed to fill some of the required fields.");
    }

    const isUserExists = await User.findOne({
        $or : [ {userId},  {email}]
    });

    if(isUserExists){
        throw new ApiError(400, "User with the provided email or username already exists");
    }

    const userDetails = await User.create({
        fullName,
        userId,
        email,
        password,
        mobileNumber
    });

    if(!userDetails){
        throw new ApiError(500, "Something went wrong while registering the user!!!")
    }
    const createdUser = await User.findById(userDetails._id).select("-password -refreshToken");
    
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully!!!")
    );
});


export {registerUser};