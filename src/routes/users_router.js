import { Router } from "express";
import {
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
} from "../controllers/user_controller.js";
import { verifyJWT } from "../middlewares/auth_middleware.js";

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutuser);
userRouter.route("/testing").post(verifyJWT, testingTokenExpiry);
userRouter.route("/addToCart").post(verifyJWT, addToCart);
userRouter.route("/fetchCartDetails").get(verifyJWT, fetchCartDetails);
userRouter.route("/modifyCart").put(verifyJWT, modifyCart);
userRouter.route("/addAddress").post(verifyJWT,addAddress);
userRouter.route("/editAddress").put(verifyJWT,editAddress);
userRouter.route("/deleteAddress").delete(verifyJWT,deleteAddress);
userRouter.route("/resetPassword").post(resetPassword);
userRouter.route("/fetchUserOrders").get(verifyJWT,fetchUserOrders);

export default userRouter;
