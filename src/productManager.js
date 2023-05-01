import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "./src/products.json";
    this.products = [];
    this.id = 0;
  }

  async loadData(){
    try{
      const data = await fs.promises.readFile(this.path, "utf-8");
      const parsedData = JSON.parse(data);
      this.products = parsedData.products;
      this.id = parsedData.lastId;
    }catch(error){
      console.log("Loading error");
      console.log("Creating new data file...");
      try{
        await fs.promises.writeFile(this.path, JSON.stringify({ lastId: 0, products: []}, null, 2), "utf-8");
        console.log("File successfully created");
      } catch(error) {
        console.log("Error creating file");
      }
    }
  }

  async saveData() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify({ lastId: this.id, products: this.products }, null, 2), "utf-8"
      );
    } catch(error) {
      console.log("Saving data error");
    }
  }

  async addProduct(product) {
    await this.loadData();
    if(this.products.some((item) => item.code === product.code)) {
      return "Item already exists";
    }
    if(
      !product.title || 
      !product.description || 
      !product.price ||
      !product.thumbnail ||
      !product.code || 
      !product.stock
    ) {
      return "Product required properties not found";
    }
    product = { id: ++this.id, ...product };
    this.products.push(product);
    await this.saveData();
    return "Product added";
  }

  async getProductById(id) {
    await this.loadData();
    return this.products.find((product) => product.id === id) ?? "Not found";
  }

  async getProducts() {
    await this.loadData();
    return this.products.length > 0 ? this.products : "No products";
  }

  async updateProducts(id, product) {
    await this.loadData();
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return "Product not found";
    }
    this.products[productIndex] = { ...this.products[productIndex], ...product, id: this.products[productIndex].id };
    await this.saveData();
    return "Product successfully updated";
  }


  async deleteProduct(id) {
    await this.loadData();
    const productIndex = this.products.findIndex((product) => product.id === id);
    if(productIndex === -1) {
      return "Product not found";
    }
    this.products.splice(productIndex, 1);
    await this.saveData();
    return "Product successfully deleted";
  }
}

execute();

async function execute(){
  const prodManager = new ProductManager("products.json");
  console.log(await prodManager.getProducts());

  const prod1 = {
       title: "Marcador negro",
       description: "Marcador color negro a base de agua para pizarras/pizarrones.",
       price: 100,
       thumbnail:
         "https://d22fxaf9t8d39k.cloudfront.net/7048c9a8198636bae8212267c57cfe49c6c8cae83883c3f853ce8cfe27b5f40380237.png",
       code: "abc123",
       stock: 42,
     };

     console.log(await prodManager.addProduct(prod1));
     console.log(await prodManager.getProducts());
     console.log(await prodManager.getProductById(1));

     const prod1Update = {
      title: "Titulo actualizado",
      description: "Descripción actualizada",
     };

     console.log(await prodManager.updateProducts(1, prod1Update));

     const prod2 = {
         title: "Marcador rojo",
         description: "Marcador color rojo a base de agua para pizarras/pizarrones.",
         price: 120,
         thumbnail:
           "https://www.librerialacentral.com.ar/wp-content/uploads/2021/10/MARCADOR-PIZARRA-TRABI-450-ROJO.JPG.png",
         code: "abc124",
         stock: 27,
       };

       console.log(await prodManager.addProduct(prod2));
       console.log(await prodManager.deleteProduct(3));
}
  


export default ProductManager;