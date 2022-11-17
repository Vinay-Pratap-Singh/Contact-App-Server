const express = require("express");
const addContact = require("../controllers/controller");
const Router = express.Router();

Router.post("/addcontact", addContact);

module.exports = Router;
