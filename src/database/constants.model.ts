import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    price: {
        type: Number,
        default: 0,
        required: true,
    }
  },
  { timestamps: true }
);

const Constants = mongoose.models.Constants || mongoose.model("Constants", userSchema);
export default Constants;