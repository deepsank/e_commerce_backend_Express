import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutuser,
  testingTokenExpiry
} from "../controllers/user_controller.js";
import { verifyJWT } from "../middlewares/auth_middleware.js";

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutuser);
userRouter.route("/testing").post(verifyJWT, testingTokenExpiry);

export default userRouter;
