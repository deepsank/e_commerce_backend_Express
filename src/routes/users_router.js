import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutuser,
  testingTokenExpiry,
  addToCart,
  fetchCartDetails
} from "../controllers/user_controller.js";
import { verifyJWT } from "../middlewares/auth_middleware.js";

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutuser);
userRouter.route("/testing").post(verifyJWT, testingTokenExpiry);
userRouter.route("/addToCart").post(verifyJWT, addToCart);
userRouter.route("/fetchCartDetails").get(verifyJWT, fetchCartDetails);

export default userRouter;
