const Contact = require("../model/contact");

const addContact = async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) res.send("Please fill both the fields");
  else {
    try {
      const checkPhone = Contact.findOne(phone);
      if (checkPhone) res.send("Number already exists");
      else {
        const newContact = new Contact({ name, phone });
        await newContact.save();
        res.send("Contact Created Succesfully");
      }
    } catch (error) {
      res.send("Contact Creation Failed");
    }
  }
};

module.exports = addContact;
