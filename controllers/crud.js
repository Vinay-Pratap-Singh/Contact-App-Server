const User = require("../model/user");

// function to add new contact
exports.addContact = async (req, res) => {
  const id = req.id;
  let { name, phone } = req.body;

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

  // creating the new contact
  const newContact = { name, phone };

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
    res.status(500).json({
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

  // if exist then updating that one
  newContactArray[index].name = name;
  newContactArray[index].phone = phone;

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
      message: "failed to update contact",
      error,
    });
  }
};
