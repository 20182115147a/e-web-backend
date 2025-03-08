import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const User = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
  profile: {
    fullName: String,
    avatar: String,
    address: String,
    phone: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
User.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
User.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


export default mongoose.model('User',User)