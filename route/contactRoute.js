const express = require("express");
const { signup, login } = require("../controllers/account");
const { addContact, deleteContact, displayContact, updateContact } = require("../controllers/crud");
const { dashboard } = require("../controllers/dashboard");
const { auth } = require("../middleware/auth");
const Router = express.Router();

Router.post("/addcontact", addContact)
Router.post("/deletecontact", deleteContact)
Router.post("/displaycontact", displayContact)
Router.post("/updatecontact", updateContact)
Router.post("/signup", signup)
Router.post("/login",login)
Router.get("/dashboard", auth, dashboard);

module.exports = Router;
