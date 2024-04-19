import { asyncMethodHandler } from "../utils/asyncMethodHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users_models.js";
import { Product } from "../models/products_models.js";
import mongoose from "mongoose";
import { Order } from "../models/order_models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Some error occurred while generating access and refresh Tokens!!!"
    );
  }
};

const registerUser = asyncMethodHandler(async (req, res) => {
  //1.Get the user details
  //2.Validate the details entered -- not empty etc. etc.
  //3.See if users already exists with that username or email,.. if yes then return error
  //4.Upload profile photo to local and cloudinary
  //5.Once successfully uploaded on cloudinary, then remove from the local server
  //6.Create and Insert the user object in the DB
  //7.verify that users details got stored in the DB
  //8.remove fields like password and refereshToken before sending the userDetails as response to the Client
  //9.Return the response

  const { fullName, userName, email, password, mobileNumber } = req.body;

  if (
    [fullName, userName, email, password, mobileNumber].some((key) => {
      return key?.trim() === "";
    })
  ) {
    throw new ApiError(
      400,
      "All fields are mandatory, you have missed to fill some of the required fields."
    );
  }

  const isUserExists = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (isUserExists) {
    throw new ApiError(
      400,
      "User with the provided email or username already exists!!!"
    );
  }

  const userDetails = await User.create({
    fullName,
    userName,
    email,
    password,
    mobileNumber,
  });

  if (!userDetails) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user!!!"
    );
  }
  const createdUser = await User.findById(userDetails._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully!!!"));
});

const loginUser = asyncMethodHandler(async (req, res) => {
  //1.Extract the login details like userName/email/mobileNumber and password
  //2.Check the email/mobileNumber/userName whether they exists or not,... if not then, return error
  //3.verify the password with the hashed password from the DB
  //4.generate AccessToken and RefreshToken for the user
  //5.set the AccessToken and RefreshToken as the cookies
  //6.return the response

  const { userName, mobileNumber, email, password } = req.body;

  console.log(email);
  if (
    [userName, mobileNumber, email, password].some((key) => {
      return key?.trim() === "";
    })
  ) {
    throw new ApiError(
      400,
      "At least one of the fields are required out of userName, email and mobileNumber!!!"
    );
  }

  const userDetails = await User.findOne({
    $or: [{ userName }, { email }, { mobileNumber }],
  });

  if (!userDetails) {
    throw new ApiError(401, "Invalid user credentials!!!");
  }

  const isPasswordCorrect = await userDetails.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials!!!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userDetails._id
  );

  const loggedInUser = await User.findById(userDetails._id).select(
    "-password -refreshToken -accessToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
          accessToken,
        },
        "Logged in successfully!!!"
      )
    );
});

const logoutuser = asyncMethodHandler(async (req, res) => {
  //1.fetching the current LoggedIn User details using the middleware verifyJWT (This middleware uses cookies or Authorization headers to extract the accessToken and then decodes it, and then based on the decoded data, executes a DB query to fetch the logged in Users details, and using this we get the access to logout the user by expiring the accessToken and refreshToken 's )
  //2.This middleware can we used in any other api to check the loggedIn users authoriztion access
  //3.Remove the refreshToken from the DB for the user (or reset it to undefined)
  //4.Remove the cookies from the client's browser
  //5.Return the response

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      refreshToken: undefined,
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully!!!"));
});

const testingTokenExpiry = function (req, res) {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Successfully Tested the token expiry and resource access"
      )
    );
};

const addToCart = asyncMethodHandler(async (req, res) => {
  const { productID, quantity } = req.body;
  const productExists = await Product.findById(productID);
  if(!productExists){
    console.log("Erororrrrrrrrrrrrrrrrrrororor!!!")
    return res.status(400).json(new ApiResponse(400,{},"Product doesn't Exits!!!"));
  }
  const user = await User.findById(req.user?._id);
  const ObjectId = mongoose.Types.ObjectId;

  // Assuming productID is a string representing the product's ObjectId
  // const productObjectId = new ObjectId(productID);
  if (!user) {
    return res.status(401).json(new ApiError(401, "Unauthorized access!!!",["Unauthorized access!!!"]));
  }

  const productExistsForTheUserIndex = user.cart.findIndex((item) => {
    console.log("item.productID", item.productID);
    // console.log("productID", productObjectId);
    return item.productID.equals(productID);
  });
  if (productExistsForTheUserIndex !== -1) {
    user.cart[productExistsForTheUserIndex].quantity = quantity;
    console.log("Hellloooooooooooooooooooooooooooooo");
  } else {
    console.log("Worldddddddddddddddddddddddddddddddd");
    const cartItem = {
      productID: productID, // Assuming productId is the ObjectID of the product
      quantity: quantity,
    };
    user.cart.push(cartItem);
  }

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Added to the cart successfully!!!"));
});

const fetchCartDetails = asyncMethodHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productIDs = user.cart.map((item) => item.productID);
  const productDetails = [];

  for (const productID of productIDs) {
    const product = await Product.findById(productID);
    productDetails.push(product);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { productDetails },
        "Fetched products of the cart successfully!!!"
      )
    );
});

const modifyCart = asyncMethodHandler (async (req,res)=>{
  const { productID, quantity } = req.body;
  const productExists = await Product.findById(productID);
  if(!productExists){
    console.log("Erororrrrrrrrrrrrrrrrrrororor!!!")
    return res.status(400).json(new ApiResponse(400,{},"Product doesn't Exits!!!"));
  }
  const user = await User.findById(req.user?._id);

  // Assuming productID is a string representing the product's ObjectId
  // const productObjectId = new ObjectId(productID);
  if (!user) {
    return res.status(401).json(new ApiError(401, "Unauthorized access!!!",["Unauthorized access!!!"]));
  }

  if(quantity<=0){
    user.cart = user.cart.filter((item)=> !item.productID.equals(productID) );
    await user.save();
    console.log("Removing the item successfully from the cart!")

    return res
    .status(201)
    .json(new ApiResponse(201, { user }, "Removed the item successfully from the cart!!!"));
     
  }

  const productExistsForTheUserIndex = user.cart.findIndex((item) => {
    console.log("item.productID", item.productID);
    // console.log("productID", productObjectId);
    return item.productID.equals(productID);
  });
  if (productExistsForTheUserIndex !== -1) {
    user.cart[productExistsForTheUserIndex].quantity = quantity;
    console.log("Hellloooooooooooooooooooooooooooooo");
  } else {
    console.log("Worldddddddddddddddddddddddddddddddd");
    const cartItem = {
      productID: productID, // Assuming productId is the ObjectID of the product
      quantity: quantity,
    };
    user.cart.push(cartItem);
  }

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Modified the cart successfully!!!"));
});

const addAddress = asyncMethodHandler(async(req,res)=>{
    const { street,city,state,pinCode} = req.body;
    const user = req.user;
    user.addresses.push({street,city,state,pinCode});

    await user.save();
    const userDetailsAfterSaving = await User.findById(user._id);
    if(!userDetailsAfterSaving){
      return res.status(400).json(new ApiError(400,"Something went wrong while saving the address!!!",["Something went wrong while saving the address!!!"]));
    }
    const isAddressAdded = userDetailsAfterSaving.addresses.find((element)=> {
      return element.street === street;
    })
    if(!isAddressAdded){
      return res.status(400).json(new ApiError(400,"Something went wrong while saving the address!!!",["Something went wrong while saving the address!!!"]));
    }
    return res.status(201).json(new ApiResponse(201,{user: userDetailsAfterSaving},"Address saved successfully!!!"));
});

const editAddress = asyncMethodHandler(async(req,res)=>{
  const { street,city,state,pinCode, _id} = req.body;
    const user = req.user;
    const addressIndex = user.addresses.findIndex(address => address._id.equals(_id));

    if(addressIndex !==-1){
      user.addresses[addressIndex].street=street;
      user.addresses[addressIndex].city=city;  //----------- these fields should not be allowed to be changed logically as address should not change dramatically
      user.addresses[addressIndex].state=state;
      user.addresses[addressIndex].pinCode=pinCode;

      await user.save();

      return res.status(201).json(new ApiResponse(201,{user},"Editted the address successfully!!!"));
    }
    else{
      console.log("Something went wrong while editting the address!!!");
      return res.status(400).json(new ApiError(400,"Something went wrong while editting the address!!!",["Something went wrong while editting the address!!!"]));
    }
});

const deleteAddress = asyncMethodHandler(async(req,res)=>{
    const user = req.user;
    const {addressID} = req.body;
   
    if(!addressID){
      return res.status(400).json(new ApiError(400,"",["Please select correct address to delete!!!"]))
    }
    const updatedUser = await User.findByIdAndUpdate(user._id,{
      $pull : {addresses: {_id:new mongoose.Types.ObjectId(addressID) }}
    },{
      new : true
    });

    console.log(updatedUser);

    if(!updatedUser){
      return res.status(400).json(new ApiError(400,"",["Something went wrong, User not found!!!"]))
    }
    return res.status(200).json(new ApiResponse(200,{user: updatedUser},"Address deleted successfully!!!"));

});

const resetPassword = asyncMethodHandler(async(req,res)=>{
  const { email,oldPassword, newPassword} = req.body;
  const user = await User.findOne({email});

  if(!user){
    return res.status(401).json(new ApiError(401,"No users exist with the specified email!!!",["No users exist with the specified email!!!"]))
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials!!!");
  }

  user.password= newPassword;
  const userAfterPwdChange = await user.save();
  if(!userAfterPwdChange){
    return res.status(401).json(new ApiError(401,"", ["Something went wrong while resetting the passwrod!!!"]));
  }
  return res.status(201).json(new ApiResponse(201,{user : userAfterPwdChange},"Password changed successfully!!!"));

});

const fetchUserOrders = asyncMethodHandler(async(req,res)=>{
  const user = req.user;
  const orderDetails = await Order.find({userId:user._id});
  if(!orderDetails){
    return res.status(400).json(new ApiError(400,"",["No orders placed till now!!!"]));
  }
  return res.status(200).json(new ApiResponse(200,{orderDetails},"Fetched orders for the user successfully!!!"));
});
export {
  registerUser,
  loginUser,
  logoutuser,
  testingTokenExpiry,
  addToCart,
  fetchCartDetails,
  modifyCart,
  addAddress,
  editAddress,
  deleteAddress,
  resetPassword,
  fetchUserOrders
};
