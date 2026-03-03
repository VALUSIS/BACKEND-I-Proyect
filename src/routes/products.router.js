import { Router } from "express";
import Product from "../models/Product.model.js";
console.log("Products router cargado");
const router = Router();


router.get("/", async (req, res) => {
  try {
    const { category, stock, sort, page = 1, limit = 5 } = req.query;

    let filter = {};
console.log("Category recibida:", category);
console.log("Filtro final:", filter);
 
    if (category && category.trim() !== "") {
  filter.category = {
    $regex: `^${category.trim()}$`,
    $options: "i"
  };
}
   
    if (stock === "true") {
      filter.stock = { $gt: 0 };
    }

    let query = Product.find(filter);

    
    if (sort === "asc") {
      query = query.sort({ price: 1 });
    }

    if (sort === "desc") {
      query = query.sort({ price: -1 });
    }

    const products = await query
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.render("products", {
      products,
      page: Number(page),
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: Number(page) - 1,
      nextPage: Number(page) + 1
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:pid", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:pid", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.pid);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;