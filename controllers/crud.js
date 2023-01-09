const User = require("../model/user");
const cloudinary = require("cloudinary");

// function to add new contact
exports.addContact = async (req, res) => {
  const id = req.id;
  let { name, phone } = req.body;

  // array of multiple colors
  const myColors = ["#000000", "#777777", "#ed6868", "#cb68ed", "#537dd1", "#53b8d1", "#53d1ba", "#53d18e", "#59d153", "#d1aa38", "#4f2b72", "#e09147"]
  
  // randomly selecting a color for contact logo background
  const color = myColors[Math.floor(Math.random() * myColors.length)];

  // getting the contact profile image
  let photo = undefined;
  try {
    photo = req.files.photo;
  } catch (error) {
    photo = "";
  }

  // checking that the name and number is empty or not
  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "All fields are mandatory",
    });
  }

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

  // saving the image on cloudinary
  let photoUrl = "";
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

  // creating the new contact
  const newContact = { name, phone, photo: photoUrl, bgColor:color };

  // adding the new contact to the user list
  myUser.contact.push(newContact);

  // saving the new data into the database
  try {
    await myUser.save();
    return res.status(200).json({
      success: true,
      message: "New contact created",
    });
  } catch (error) {
    // if failed to save user then deleting the user picture
    if (photoUrl) {
      const url = photoUrl.split("/");
      const image = url[url.length - 1];
      const imageName = image.split(".");
      await cloudinary.uploader.destroy(imageName[0]);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to save new contact",
    });
  }
};

// function to delete the individual contact
exports.deleteContact = async (req, res) => {
  // getting the id of user
  const id = req.id;

  // getting the id of number to be deleted
  const { deleteId } = req.body;

  // checking that the user exist in db or not
  let myUser;
  try {
    myUser = await User.findById({ _id: id });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User not found",
      error,
    });
  }

  // if user does not exist
  if (!myUser) {
    return res.status(200).json({
      success: false,
      message: "User not found",
    });
  }

  // finding the contact number to delete
  const newContactArray = myUser.contact;
  let index = undefined;
  for (let i = 0; i < newContactArray.length; i++) {
    if (newContactArray[i]._id == deleteId) {
      index = i;
      break;
    }
  }

  // if not found
  if (index === undefined) {
    return res.status(400).json({
      success: false,
      message: "Contact does not exist",
    });
  }

  // getting the image url of cloudinary
  const photoUrl = newContactArray[index].photo;

  // deleting the image from cloudinary
  try {
    if (photoUrl) {
      const url = photoUrl.split("/");
      const image = url[url.length - 1];
      const imageName = image.split(".");
      await cloudinary.uploader.destroy(imageName[0]);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the image",
      error,
    });
  }

  // if exist then deleting that one
  newContactArray.splice(index, 1);

  try {
    // updating the data in database
    myUser.contact = newContactArray;
    await myUser.save();

    // sending back the sucessfull response
    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "failed to delete contact",
      error,
    });
  }
};

// function to update the existing contact
exports.updateContact = async (req, res) => {
  // getting the id of user
  const id = req.id;

  // getting the id, to update the field
  const { updateId, name, phone } = req.body;

  // getting the contact profile image
  let photo = undefined;
  try {
    photo = req.files.photo;
  } catch (error) {
    photo = "";
  }

  // checking that the user exist in db or not
  let myUser;
  try {
    myUser = await User.findById({ _id: id });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User not found",
      error,
    });
  }

  // if user does not exist
  if (!myUser) {
    return res.status(200).json({
      success: false,
      message: "User not found",
    });
  }

  // finding the contact number to update
  const newContactArray = myUser.contact;
  let index = undefined;
  for (let i = 0; i < newContactArray.length; i++) {
    if (newContactArray[i]._id == updateId) {
      index = i;
      break;
    }
  }

  // if not found
  if (index === undefined) {
    return res.status(400).json({
      success: false,
      message: "Contact does not exist",
    });
  }

  // saving the new profile image on cloudinary
  let photoUrl = "";
  if (photo) {
    // saving the image on cloudinary and getting the link
    try {
      const isUploaded = await cloudinary.uploader.upload(photo.tempFilePath);
      photoUrl = isUploaded.url;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update image",
        error,
      });
    }
  }

  // if exist then updating that one
  newContactArray[index].name = name;
  newContactArray[index].phone = phone;
  if (photoUrl) {
    newContactArray[index].photo = photoUrl;
  }

  try {
    // updating the data in database
    myUser.contact = newContactArray;
    await myUser.save();

    // sending back the sucessfull response
    return res.status(200).json({
      success: true,
      message: "Contact updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update contact",
      error,
    });
  }
};

// function for displaying the user data with contacts
exports.dashboard = async (req, res) => {
  const id = req.id;
  let userData;

  try {
    userData = await User.findById({ _id: id });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to get user",
    });
  }

  if (!userData) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  // removing the password from data
  userData.password = undefined;

  return res.status(200).json({
    success: true,
    data: userData,
  });
};
