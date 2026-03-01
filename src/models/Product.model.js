import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  status: {
    type: Boolean,
    default: true
  }
});

productSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", productSchema);