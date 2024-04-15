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
    userName: {
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

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken =  function(){
  return  jwt.sign({
    _id : this._id,
    userName : this.userName,
    email : this.email,
    mobileNumber : this.mobileNumber,
    fullName : this.fullName
  },
  process.env.ACCESS_TOKEN_SECRET
  ,{
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY
  }
);
}

userSchema.methods.generateRefreshToken =  function(){
  return  jwt.sign({
    _id : this._id
   
  },
  process.env.REFRESH_TOKEN_SECRET
  ,{
    expiresIn : process.env.REFRESH_TOKEN_EXPIRY
  }
);
}

export const User = mongoose.model("User", userSchema);
