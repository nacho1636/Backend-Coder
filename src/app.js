import express from "express";
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { homeRouter } from "./routes/home.router.js";
import { realTimeRouterSockets } from "./routes/realTimeProducts.router.js";
import { __dirname, connectMongo } from "./utils.js";
import { connectSocket } from "./sockets.js";
import handlebars from "express-handlebars";
import path from "path";


/*----------------------PORT-CONFIG---------------------*/
const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port: http://localhost:${PORT}/home`);
});

/*---------------------CONNECTIONS----------------------*/
connectMongo();
connectSocket(httpServer);


/*------------------TEMPLATE-ENGINES-------------------*/
app.engine('handlebars', handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


/*------------------------ROUTERS-------------------------*/
//api rest json router
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
//HTML render server side router
app.use("/home", homeRouter);
//Socket router
app.use("/realtimeproducts", realTimeRouterSockets);



app.get("*"), (req, res) => {
  res.status(404).json({ status: "error", msg: "Not found", data: {} })
};


