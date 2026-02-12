import Product from "#/models/Product";
import { Router, Request, Response } from "express";

export const getPackages = async (req: Request, res: Response) => {
  try {
    // const name = req.params.name;
    const packageName = req.params.packagename;
    const product = await Product.find({ packageName });
    // console.log(product, product.length);
    if (!product || product.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.json(product);
  } catch (err) {
    console.log(err);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    // const name = req.params.name;
    const { id } = req.params;
    const product = await Product.findById(id);
    // console.log(product, product.length);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    console.log(err);
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const product = await Product.find();
    if (!product || product.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.json(product);
  } catch (err) {
    console.log(err);
  }
};
