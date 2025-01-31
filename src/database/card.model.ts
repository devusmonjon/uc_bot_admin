import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: ""
    },
    number: {
      type: Number,
      required: true,
      unique: true
    },
  },
  { timestamps: true }
);

const Card = mongoose.models.Card || mongoose.model("Card", cardSchema);
export default Card;