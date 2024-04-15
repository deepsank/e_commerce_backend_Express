import { Router } from "express";
import { listProducts ,addProduct,fetchProductById} from "../controllers/products_controller.js";
import {verifyJWT} from "../middlewares/auth_middleware.js";

const productsRouter = Router();

productsRouter.route("/listProducts").get(listProducts);
productsRouter.route("/addProduct").post(addProduct);
productsRouter.route("/fetchProductById").get(fetchProductById);

export default productsRouter;