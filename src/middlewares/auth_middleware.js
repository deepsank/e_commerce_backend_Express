import jwt from "jsonwebtoken";
import { asyncMethodHandler } from "../utils/asyncMethodHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users_models.js";

const verifyJWT = asyncMethodHandler(async (req, res, next) => {
  try {
    const accessTokenExtracted =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
  
    if (!accessTokenExtracted) {
      throw new ApiError(401, "Unauthorized request!!!, Please login Again");
    }
  
    const decodedAccessToken = jwt.verify(
      accessTokenExtracted,
      process.env.ACCESS_TOKEN_SECRET
    );
  
    const user = await User.findById(decodedAccessToken._id).select(
      "-password -refreshToken"
    );
  
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
  
    req.user = user;
  
  } catch (error) {
    throw new ApiError(401,"Some error occurred!!!",error);
    
  }
  next();
});
export { verifyJWT };
