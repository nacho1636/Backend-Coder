import { Server } from "socket.io";
import { ProductManager } from "./productManager.js";

export function connectSocket(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    console.log("New client connected " + socket.id);

    socket.on("newProduct", async (req, res) => {
      const products = new ProductManager("./products.json");
      await products.addProduct(req);
      socketServer.emit("newProduct", req);
    });

    socket.on("delete_product", async (req, res) => {
      try {
        const products = parseInt(req);
        await products.deleteProduct(req);

        socketServer.emit("delete_product", req);
      } catch (err) {
        console.log(err);
      }
    });
  });
}
