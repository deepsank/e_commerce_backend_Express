import { Router } from "express";
import { listProducts ,addProduct} from "../controllers/products_controller.js";

const productsRouter = Router();

productsRouter.route("/listProducts").get(listProducts);
productsRouter.route("/addProduct").post(addProduct);

export default productsRouter;