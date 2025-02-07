import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: {
      type: Number,
      required: true,
      unique: true
  },
  lang: {
      type: String,
      default: 'uz'
  },
  role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
  },
  step: {
      type: Number,
      default: 0
  },
  currentOrderId: {
      type: mongoose.Schema.Types.ObjectId || null,
      ref: 'Orders',
      default: null
  },
  status: {
      type: Boolean,
      default: true
  }
},{ timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;