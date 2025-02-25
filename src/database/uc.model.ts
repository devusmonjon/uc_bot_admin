import mongoose from "mongoose";

const ucSchema = new mongoose.Schema(
  {
    name: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Uc =
  mongoose.models.Uc || mongoose.model("Uc", ucSchema);
export default Uc;
