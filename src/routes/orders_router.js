import { Router } from "express";
import { verifyJWT } from "../middlewares/auth_middleware.js";
import {placeOrder,fetchOrderById} from "../controllers/order_controller.js";

const ordersRouter = Router();

ordersRouter.route("/placeOrder").post(verifyJWT,placeOrder);
ordersRouter.route("/fetchOrderById/orderId/:orderId").get(fetchOrderById);

export default ordersRouter;