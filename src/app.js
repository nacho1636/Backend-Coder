import express from "express";
import ProductManager from "./productManager.js";
const itemContainer = new ProductManager();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Listening on port: http://localhost:${PORT}`);
});

app.get("/products", async(req, res) => {
  try {
    const { limit } = req.query;
  const products = await itemContainer.getProducts();
  if(limit) {
    res.status(200).json(products.slice(0, limit));
  } else {
    res.status(200).json(products);
  }
  } catch (error) {
    res.status(500).json({ message: "There was an error" });
  }
  
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
  const product = await itemContainer.getProductById(parseInt(id));
  if(!product) {    
    return res.status(404).json({ error: "Product not found" });
  } else {
    res.status(200).json(product);
  }
  } catch (error) {
    res.status(500).json({ message: "There was an error" });
  }
  
})
