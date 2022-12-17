const User = require("../model/user");

// function to add new contact
exports.addContact = async (req, res) => {
  const id = req.id;
  let { name, phone } = req.body;

  // checking that the name and number is empty or not
  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message:"All fields are mandatory"
    })
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
    })
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
      message:"New contact created"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:"Failed to save new contact"
    })
  }
};

// function to delete the individual contact
exports.deleteContact = async (req, res) => {
  
}