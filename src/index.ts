import express from "express";
import "dotenv/config";
import "./db";
import authRouter from "./ routers/auth";
import productRouter from "./ routers/products";
import ordersRouter from "./ routers/order";

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static("src/public"));
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/orders", ordersRouter);

const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
  console.log(`Port is listening on  ${PORT} right Now`);
});
