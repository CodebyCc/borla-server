import { getAll, getPackages, getProduct } from "#/controllers/products";
import { Router } from "express";

const router = Router();

router.get("/", getAll);

router.get("/get-packages/:packagename", getPackages);
// router.get("/:packagename", getPackages);
router.get("/get-one/:id", getProduct);

export default router;
