const { findOneAndDelete } = require("../model/contact");
const Contact = require("../model/contact");

// add the contact
exports.addContact = async (req, res) => {
  const { name, phone } = req.body;
  const checkPhone = await Contact.findOne({ phone });

  if (!name || !phone) res.send("Please fill both the fields");
  else if (checkPhone) res.send("Number already exists");
  else {
    try {
        const newContact = new Contact({ name, phone });
        await newContact.save();
        res.send("Contact Created Succesfully");
      }
    catch (error) {
      res.send("Contact Creation Failed");
    }
  }
};


// delete the contact
exports.deleteContact = async (req, res) => {
  
  try {
    const { phone } = req.body;
    const deletePhone = await Contact.findOneAndDelete({ phone });
    if (deletePhone) res.send("Number Deleted Succesfully");
    else res.send("Number Not Found");
  } catch (error) {
    res.status(500).send("Deletion Failed\n", error);
  }
}

// display all the contact
exports.displayContact = async (req, res) => {
  try {
    const data = await Contact.find();
    res.send(data);
  } catch (error) {
    res.send("Failed to display contact\n",error);
  }
}

// update an existing contact
exports.updateContact = async (req, res) => {
  try {
    const { existingContact, name, phone } = req.body;
    
    const updatedContact = await Contact.findOneAndUpdate({ phone: existingContact }, { name, phone });
    
    if(updatedContact) res.send("Contact Updated Succesfully");
    else res.send("Contact Updation Failed");
  } catch (error) {
    res.send(error);
  }
}