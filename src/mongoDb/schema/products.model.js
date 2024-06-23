import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export const productsCollection = "products";

const productsSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  status: { type: Boolean, default: true, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  year: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", default: "admin" } 
});

productsSchema.plugin(mongoosePaginate);

export const ProductsModel = model(productsCollection, productsSchema);