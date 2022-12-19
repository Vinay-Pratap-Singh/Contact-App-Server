const User = require("../model/user");
const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

// function for creating the new user account
exports.signup = async (req, res) => {
  let { name, email, phone, password } = req.body;

  // getting the profile photo image
  let photo = undefined;
  try {
    photo = req.files.photo;
  } catch (error) {
    photo = "";
  }

  let photoUrl = undefined;

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

  // check user send profile photo or not
  if (photo) {
    // saving the image on cloudinary and getting the link
    try {
      const isUploaded = await cloudinary.uploader.upload(photo.tempFilePath);
      photoUrl = isUploaded.url;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error,
      });
    }
  }

  // encypting the password before saving
  const hashedPassword = bcrpyt.hashSync(password, 15);

  const newUser = new User({
    name: name,
    email: email,
    phone,
    password: hashedPassword,
    photo: photoUrl,
  });

  // saving the new user
  try {
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "User registered Succesfully",
    });
  } catch (error) {
    if (photoUrl) {
      const url = photoUrl.split("/");
      const image = url[url.length - 1];
      const imageName = image.split(".");
      await cloudinary.uploader.destroy(imageName[0]);
    }

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
  if (!email || !password) {
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

  const passwordMatched = bcrpyt.compareSync(password, userExist.password);

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

  // checking that the user exists or not
  let isUser;
  try {
    isUser = await User.findOne({ _id: id });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User does not exist",
    });
  }

  // getting the image url of cloudinary to delete
  const imageUrl = isUser.photo;

  // deleting the user if exist
  try {
    // deleting the user image from cloudinary
    if (imageUrl) {
      const url = imageUrl.split("/");
      const image = url[url.length - 1];
      const imageName = image.split(".");
      await cloudinary.uploader.destroy(imageName[0]);
    }

    // deleting the user account
    await User.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Account deleted succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user account",
      error,
    });
  }
};

// function for changing user password
exports.changePassword = async (req, res) => {
  const id = req.id;

  // getting the new password
  const { password } = req.body;

  // checking for the user
  let myUser;
  try {
    myUser = await User.findById({ _id: id });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  // if user does not exist
  if (!myUser) {
    return res.status(200).json({
      success: false,
      message: "User not found",
    });
  }

  // if user exists, then change the password
  const hashedPassword = bcrpyt.hashSync(password, 15);

  // changing the password
  myUser.password = hashedPassword;

  // saving the new data inside database
  try {
    await myUser.save();

    // expiring the token
    res.cookie("token", null, {
      expiresIn: new Date(Date.now()),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Password changed. Login again",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to change the password",
      error,
    });
  }
};

// function for changing user profile image
exports.changeUserImage = async (req, res) => {
  const id = req.id;

  // getting the new image from user
  const {photo} = req.files;

  if (!photo) {
    return res.status(400).json({
      success: false,
      message:"Upload your image"
    })
  }

  let userExist;
  // finding the user in db
  try {
    userExist = await User.findOne({ _id:id });
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

  // getting the old image link to delete
  const oldPhoto = userExist.photo;
    
  // deleting the old image from cloudinary
 try {
   if (oldPhoto) {
    const url = oldPhoto.split("/");
    const image = url[url.length - 1];
    const imageName = image.split(".");
    await cloudinary.uploader.destroy(imageName[0]);
  }
 } catch (error) {
   return res.status(500).json({
     success: false,
     message: "Failed to delete previous image",
     error
  })
  }
  
  // saving the new image on cloudinary and getting the link
  let photoUrl = "";
  try {
    const isUploaded = await cloudinary.uploader.upload(photo.tempFilePath);
    photoUrl = isUploaded.url;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error,
    });
  }

  // saving the new link inside the user record
  userExist.photo = photoUrl;

  try {
    await userExist.save();
    return res.status(200).json({
      success: true,
      "message":"Profile image updated succesfully"
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to save image",
      error
    })
  }
}