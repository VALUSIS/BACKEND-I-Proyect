import { Router } from "express";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";

const router = Router();


router.get("/", (req, res) => {
  res.redirect("/products");
});

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, category, stock } = req.query;

    let filter = {};

    
    if (category && category.trim() !== "") {
      filter.category = {
        $regex: `^${category.trim()}$`,
        $options: "i"
      };
    }


    if (stock === "true") {
      filter.stock = { $gt: 0 };
    }

    let options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true
    };


    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const result = await Product.paginate(filter, options);

    res.render("products", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      totalPages: result.totalPages,
      page: result.page
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
});


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