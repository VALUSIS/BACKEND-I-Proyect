import { Router } from "express";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";

const router = Router();


router.get("/", (req, res) => {
  res.redirect("/products");
});


router.get("/products", async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const result = await Product.paginate(
      {},
      { page: parseInt(page), limit: 5, lean: true }
    );

    res.render("products", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ✅ Detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    res.render("cart", { cart });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;