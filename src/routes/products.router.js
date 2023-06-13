import express from "express";
import { ProductManager } from "../productManager.js";

const products = new ProductManager("./products.json");
export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    const data = await products.getProducts();
    const limit = req.query.limit;
    const limitedProducts = limit ? data.slice(0, limit) : data;
    res.status(200).json(limitedProducts);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ status: "error", msg: "Invalid input", data: {} });
    } else {
      res
        .status(500)
        .json({ status: "error", msg: "Internal server error", data: {} });
    }
  }
});

productsRouter.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const dataId = await products.getProductById(parseInt(id));
    res.status(200).json(dataId);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ status: "error", msg: "Invalid input", data: {} });
    } else {
      res
        .status(500)
        .json({ status: "error", msg: "Internal server error", data: {} });
    }
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const data = await products.getProducts();
    let newProduct = req.body;
    let findProduct = data.find((ele) => ele.code === newProduct.code);
    if (findProduct) {
      return res.status(400).json({
        status: "error",
        msg: "Item already exists",
      });
    }
    const requiredField = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];

    
    const allFields = requiredField.every((prop) => newProduct[prop]);
    if (newProduct.id == undefined && allFields) {
      newProduct = { ...newProduct, id: data[data.length - 1].id + 1 };
      await products.addProduct({ ...newProduct, status: true });
      return res.status(200).json({
        status: "success",
        msg: "Item successfully added",
        data: newProduct,
      });
    } else {
      res.status(400).json({
        status: "error",
        msg: "Invalid input",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ status: "error", msg: "Invalid input", data: {} });
    } else {
      res
        .status(500)
        .json({ status: "error", msg: "Internal server error", data: {} });
    }
  }
});

productsRouter.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const data = await products.getProducts();
    let changeProduct = req.body;
    await products.updateProduct(id, changeProduct);
    return res.status(201).json({
      status: "success",
      msg: "Item successfully updated",
      data: changeProduct,
    });
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Invalid input", data: {} });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const data = await products.getProducts();
    let findProduct = data.find((prod) => prod.id == id);
    if (!findProduct) {
      return res.status(404).json({
        status: "error",
        msg: "Item not found",
      });
    } else {
      await products.deleteProduct(id);
      return res.status(201).json({
        status: "Success",
        msg: "Item deleted",
        data: {},
      });
    }
  } catch (err) {
    res.status(500).json({ status: "error", msg: "Invalid input", data: {} });
  }
});

productsRouter.get("*", (req, res, next) => {
  res.status(404).json({ status: "error", msg: "Cant find URL", data: {} });
});



