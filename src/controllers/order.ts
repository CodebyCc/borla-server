import { Router, Request, Response, RequestHandler } from "express";

import Order from "#/models/Order";

export const getOrders = async (req: Request, res: Response) => {
  try {
    // const name = req.params.name;

    const orders = await Order.find();
    // console.log(product, product.length);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.json(orders);
  } catch (err) {
    console.log(err);
  }
};

export const createOrder: RequestHandler = async (req, res) => {
  const { productId, coordinates, user } = req.body;

  const createOrder = await Order.create({ productId, coordinates, user });
  //   const createUserOrder = new Order({
  //     productId,
  //     coordinates,
  //     user,
  //   });
  //   await createUserOrder.save();

  res.status(201).json({ productId, coordinates, user });
};
