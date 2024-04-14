import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  pinCode: String,
});

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: [true,"Password is required for login/signup!!!"],
    },
    mobileNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Ensure it's exactly 10 digits
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
      required: [true, "Mobile number is required"],
    },
    addresses: [addressSchema],

    cart : [
        {
          productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next){
  if(!this.isModified("password"))
    return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();

});

export const User = mongoose.model("User", userSchema);
