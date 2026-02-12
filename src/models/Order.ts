import mongoose from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // captured at time of order
});

const orderSchema = new Schema({
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  items: [orderItemSchema],

  productId: {
    type: String,
  },

  coordinates: {
    type: [Number],
    // required: true, // Must be [longitude, latitude]
  },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  // paymentMethod: {
  //   type: String,
  //   enum: ["card", "paypal", "momo", "cod"], // customize as needed
  //   required: true,
  // },
  shippingAddress: {
    fullName: String,
    street: String,
    city: String,
    region: String,
    phone: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
