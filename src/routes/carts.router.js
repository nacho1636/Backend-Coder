import express from "express";
import { ProductManager } from "../productManager.js";
import { CartManager } from "../cartManager.js";


const products = new ProductManager("./products.json");
const carts = new CartManager("./carts.json");

export const cartsRouter = express.Router();

cartsRouter.get("/", async (req, res) => {
  try {
    const data = await carts.getCarts();
    res.status(200).json(data);
  } catch (err) {
    if(err instanceof Error) {
      res.status(500).json({ status: "error", msg: "Invalid input", data: {} });
    } else {
      res.status(500).json({ status: "error", msg: "Internal server error", data: {} });
    }
    
  }
});


cartsRouter.post("/", async (req, res) => {
  try {
    const data = await carts.getCarts();
    await carts.addCart({ products:[] });
    res.status(200).json(data);
  } catch (err) {
    if(err instanceof Error) {
      res.status(500).json({ status: "error", msg: "Invalid input", data: {} });
    } else {
      res.status(500).json({ status: "error", msg: "Internal server error", data:{} });
    }
    
  }
});


cartsRouter.get("/:cid", async (req, res) => {
  try {
    const dataCarts = await carts.getCarts();
    const id = req.params.cid;
    const dataId = await carts.getCartById(parseInt(id));
    if(dataId) {
      res.status(200).json(dataId);
    } else {
      res.status(200).json(`Cart with id:${id}, doesn't exist`)
    }
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Internal server error", data: {} });
  }
});


cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const dataCarts = await carts.getCarts();
    const dataProducts = await products.getProducts();
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cartFound = dataCarts.find((ele) => ele.id == cartId);
    if(!cartFound) {
      res.status(200).json(`Cart with id:${cartId}, doesn't exist`);
    }
    const productFound = dataProducts.find((ele) => ele.id == parseInt(productId));
    if(!productFound) {
      res.status(200).json(`Cart with id:${productId}, doesn't exist`);
    }
    const product = await carts.updateCart(parseInt(cartId), parseInt(productId));
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Internal server error", data: {} });
  }
});


cartsRouter.get("*", (req, res) => {
  res.status(404).json({ status: "error", msg: "Cant find URL", data: {} });
});


