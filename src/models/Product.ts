import mongoose from "mongoose";

interface ProductDocument {
  id: mongoose.Schema.Types.ObjectId;
  productname: string;
  price: number;
  packageName: string;
  description: string;
  size: string;
  bullets: [string];
  imageUrl: string;
}

const productSchema = new mongoose.Schema<ProductDocument>(
  {
    productname: { type: String, required: true, unique: true },

    price: { type: Number, required: [true, "product must have a price"] },

    packageName: { type: String },
    description: { type: String },
    size: { type: String },
    bullets: { type: [String] },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

// const Product =
//   mongoose.models.Product || mongoose.model("Product", productSchema);

// export default Product;

export default mongoose.model(
  "Product",
  productSchema
) as mongoose.Model<ProductDocument>;
