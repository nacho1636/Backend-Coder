import express from "express";
import { ProductManager } from "../productManager.js";

export const homeRouter =  express.Router();
const homeProductsManager = new ProductManager("./products.json");

homeRouter.get("/", async (req, res) => {
    try {
        const productFound = await homeProductsManager.getProducts();

        if(productFound) {
            return res.status(200).render("home", {products: productFound});
        }

    } catch (err) {
       return res.status(400).json({
        status: "error",
        msg: "The required list doesn't exist",
        data: {},
       });
    }
});
