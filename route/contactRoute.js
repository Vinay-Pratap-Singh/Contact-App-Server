const express = require("express");
const { signup, login } = require("../controllers/account");
const { addContact, deleteContact, updateContact } = require("../controllers/crud");
const { dashboard } = require("../controllers/dashboard");
const { auth } = require("../middleware/auth");
const Router = express.Router();

Router.post("/addcontact", auth, addContact);
Router.delete("/deletecontact", auth, deleteContact);
Router.patch("/updatecontact",auth, updateContact)
Router.post("/signup", signup);
Router.post("/login", login);
Router.get("/dashboard", auth, dashboard);

module.exports = Router;
