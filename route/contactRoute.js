const express = require("express");
const { addContact, deleteContact, displayContact, updateContact } = require("../controllers/controller");
const Router = express.Router();

Router.post("/addcontact", addContact)
Router.post("/deletecontact", deleteContact)
Router.post("/displaycontact", displayContact)
Router.post("/updatecontact", updateContact)

module.exports = Router;
