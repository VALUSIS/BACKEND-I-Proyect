import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

import ProductManager from "./managers/ProductManager.js";

const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

const io = new Server(httpServer);

const manager = new ProductManager("./data/products.json");

io.on("connection", async socket => {
  console.log("Cliente conectado");

 
  const products = await manager.getProducts();
  socket.emit("productsUpdated", products);

  socket.on("newProduct", async product => {
  if (!product.title || !product.price) return;

  await manager.addProduct(product);
  const products = await manager.getProducts();
  io.emit("productsUpdated", products);
});

  socket.on("deleteProduct", async id => {
    await manager.deleteProduct(id);
    const products = await manager.getProducts();
    io.emit("productsUpdated", products);
  });
});

