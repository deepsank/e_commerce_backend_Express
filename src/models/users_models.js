import mongoose from "mongoose";

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
    name: {
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
      required: true,
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

export const User = mongoose.model("User", userSchema);
