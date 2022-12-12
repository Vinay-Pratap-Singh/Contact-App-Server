const Contact = require("../model/contact");

// add the contact
exports.addContact = async (req, res) => {
  const { name, phone } = req.body;
  const checkPhone = await Contact.findOne({ phone });

  if (!name || !phone) {
    res.json({
      status: 400,
      message: "Please fill all the required fields",
    });
  } else if (checkPhone) {
    res.json({
      status: 400,
      message: "Number already exists",
    });
  } else if (phone.toString().length !== 10) {
    res.json({
      status: 400,
      message: "Number length should be 10",
    });
  } else {
    try {
      const newContact = new Contact({ name, phone });
      await newContact.save();
      res.send("Contact Created Succesfully");
    } catch (error) {
      res.send("Contact Creation Failed");
    }
  }
};

// delete the contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.body;
    const deletePhone = await Contact.findByIdAndDelete({ _id:id });
    if (deletePhone) {
      res.json({
        status: 200,
        message: "Number Deleted Succesfully",
      });
    } else {
      res.json({
        status: 400,
        message: `Number ${phone} Not Found`,
      });
    }
  } catch (error) {
    res.json({
      status: 500,
      message: "Deletion Failed",
      error: error,
    });
  }
};

// display all the contact
exports.displayContact = async (req, res) => {
  try {
    const data = await Contact.find();
    res.send(data);
  } catch (error) {
    res.json({
      status: 500,
      message: "Failed to display data",
    });
  }
};

// update an existing contact
exports.updateContact = async (req, res) => {
  try {
    const { id, name, phone } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate({_id:id},{name,phone});

    if (updatedContact) {
      res.json({
        status: 200,
        message:"Contact Updated Succesfully"
      })
    }
    else {
      res.json({
        status: 500,
        message:"Contact Updation Failed"
      })
    }
  } catch (error) {
    res.json({
      status: 500,
      message: "Contact Updation Failed",
      error:error
    })
  }
};
