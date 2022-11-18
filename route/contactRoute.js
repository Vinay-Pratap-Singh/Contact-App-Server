const express = require("express");
const { addContact, deleteContact, displayContact } = require("../controllers/controller");
const Router = express.Router();

Router.post("/addcontact", addContact)
Router.post("/deletecontact", deleteContact)
Router.post("/displaycontact", displayContact)

module.exports = Router;
