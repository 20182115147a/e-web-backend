import mongoose from "mongoose";

const Product = mongoose.Schema(  {
    name: {
      type: String,
      required: true, 
      trim: true, 
    },
    description: {
      type: String,
      required: true, 
    },
    price: {
      type: Number,
      required: true, 
      min: 0, 
    },
    category: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true, 
    },
    images: {
      type: [String], 
      default: [], 
    },
    stock: {
      type: Number,
      required: true, 
      min: 0, 
    },
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Tham chiếu đến model User (người đánh giá)
        },
        rating: {
          type: Number,
          min: 1, 
          max: 5, 
        },
        comment: {
          type: String, 
        },
        createdAt: {
          type: Date,
          default: Date.now, 
        },
      },
    ],
    deleted: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    updatedAt: {
      type: Date,
      default: Date.now, 
    },
  },
  {
    timestamps: true, 
  })
export default mongoose.model("Product",Product)