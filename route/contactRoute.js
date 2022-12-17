const express = require("express");
const { signup, login, logout, deleteUser } = require("../controllers/account");
const {
  addContact,
  deleteContact,
  updateContact,
} = require("../controllers/crud");
const { dashboard } = require("../controllers/dashboard");
const { auth } = require("../middleware/auth");
const Router = express.Router();

// user routes
Router.post("/signup", signup);
Router.post("/login", login);
Router.get("/logout", auth, logout);
Router.get("/deleteuser", auth, deleteUser);

// contacts route
Router.post("/addcontact", auth, addContact);
Router.delete("/deletecontact", auth, deleteContact);
Router.patch("/updatecontact", auth, updateContact);
Router.get("/dashboard", auth, dashboard);

module.exports = Router;
