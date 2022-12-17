const User = require("../model/user");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findByIdAndDelete } = require("../model/user");

// function for creating the new user account
exports.signup = async (req, res) => {
  let { name, email, phone, password } = req.body;

  // check for empty field
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Fields can not be empty",
    });
  }

  let oldUser;
  try {
    oldUser = await User.findOne({ email: email.toLowerCase() });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error,
    });
  }
  // checking that the user already registered or not
  if (oldUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // encypting the password before saving
  const hashedPassword = bcrpyt.hashSync(password, 15);

  const newUser = new User({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    phone,
    password: hashedPassword,
  });

  // saving the new user
  try {
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "User registered Succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save user",
      error,
    });
  }
};

// function for login in the user account
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // checking that the fields are empty or not
  if ((!email, !password)) {
    return res.status(400).json({
      success: false,
      message: "Fields cannot be empty",
    });
  }

  let userExist;
  // finding the user in db
  try {
    userExist = await User.findOne({ email });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }

  // if user does not exist
  if (!userExist) {
    return res.status(400).json({
      success: false,
      message: "User does not exist",
    });
  }

  // if user exist then checking password

  const passwordMatched = await bcrpyt.compare(password, userExist.password);

  // if password does not match
  if (!passwordMatched) {
    return res.status(400).json({
      success: false,
      message: "Invalid details",
    });
  }

  // generating the token for the user
  const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
    expiresIn: "2hr",
  });

  // sending the token to user in cookie
  res.status(200).cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 120),
  });

  // removing the password before sending the data
  userExist.password = undefined;

  return res.status(200).json({
    success: true,
    message: "Login Succesfully",
    data: userExist,
  });
};

// function for log out user account
exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expiresIn: new Date(Date.now()),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "Logout succesfully",
  });
};

// function for deleting the user account
exports.deleteUser = async (req, res) => {
  // getting the id of the user
  const id = req.id;

  // deleting the user if exist
  try {
    await User.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Account deleted succesfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to delete user account",
      error,
    });
  }
};
