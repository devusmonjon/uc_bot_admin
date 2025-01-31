import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },
    image: {
      type: String,
      required: true,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Collection =
  mongoose.models.Collection || mongoose.model("Collection", collectionSchema);
export default Collection;
