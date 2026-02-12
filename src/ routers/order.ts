import { createOrder, getOrders } from "#/controllers/order";
import { getAll, getPackages, getProduct } from "#/controllers/products";
import { Router } from "express";

const router = Router();

router.get("/", getOrders);

router.post("/create-order", createOrder);
// router.get("/:packagename", getPackages);
// router.get("/get-one/:id", getProduct);

export default router;
