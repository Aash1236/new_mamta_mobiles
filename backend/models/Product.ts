import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[]; 
  inStock: boolean;
  description: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    images: { type: [String], required: true }, 
    inStock: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

// Prevent overwriting the model if it already exists
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;