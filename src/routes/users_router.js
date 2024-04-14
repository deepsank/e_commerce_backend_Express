import { Router } from "express";
import {registerUser} from '../controllers/user_controller.js'

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser);

export default userRouter;