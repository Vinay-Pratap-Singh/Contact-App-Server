const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please fill a valid email address",
    ],
  },
  phone: {
    type: Number,
    required: [true, "Phone number is required"],
    minlength: [10, "Length should be 10"],
    maxlength: [10, "Length should be 10"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be atleast 8 characters long"],
  },
  photo: {
    type: String,
  },
  contact: [
    {
      name: {
        type: "String",
        required: [true, "Name is required"],
      },
      phone: {
        type: "Number",
        required: [true, "Contact number is required"],
        minlength: [10, "Length should be 10"],
        maxlength: [10, "Length should be 10"],
      },
      photo: {
        type: "String",
      },
      bgColor: {
        type: "String",
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
