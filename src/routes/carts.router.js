import { Router } from "express";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    const product = await Product.findById(pid);

    if (!cart || !product) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }

    const existingProduct = cart.products.find(p =>
      p.product.equals(pid)
    );

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);

    cart.products = cart.products.filter(
      p => p.product.toString() !== pid
    );

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findByIdAndUpdate(
      cid,
      { products: req.body },
      { new: true }
    );

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);

    const product = cart.products.find(p =>
      p.product.equals(pid)
    );

    if (product) {
      product.quantity = quantity;
    }

    await cart.save();
    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    cart.products = [];

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;