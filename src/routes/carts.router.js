import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager("./data/carts.json");

router.post("/", async (req, res) => {
  const cart = await manager.createCart();
  res.json(cart);
});

router.get("/:cid", async (req, res) => {
  const cart = await manager.getCartById(req.params.cid);
  res.json(cart);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cart = await manager.addProductToCart(
    req.params.cid,
    req.params.pid
  );
  res.json(cart);
});

export default router;
