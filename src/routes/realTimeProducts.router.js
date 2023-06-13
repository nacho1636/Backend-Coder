import express from 'express';
import { ProductManager } from "../productManager.js";

export const realTimeRouterSockets = express.Router();
const products = new ProductManager("./products.json");

realTimeRouterSockets.get("/",async (req, res) => {
    try {
        const data = await products.getProducts();
        return res.status(200).render("realTimeProducts", { data });
    }
    catch (err) {
        return res.status(500).json({ status: "error", msg: "Internal server error", data: {} })
    }
});