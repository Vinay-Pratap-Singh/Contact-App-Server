const express = require("express");
const {
  signup,
  login,
  logout,
  deleteUser,
  changePassword,
  changeUserImage,
  removeProfile,
} = require("../controllers/account");
const {
  addContact,
  deleteContact,
  updateContact,
  dashboard,
} = require("../controllers/crud");
const { auth } = require("../middleware/auth");
const Router = express.Router();

// user routes
Router.post("/signup", signup);
Router.post("/login", login);
Router.get("/logout", auth, logout);
Router.delete("/deleteuser", auth, deleteUser);
Router.patch("/changepassword", auth, changePassword);
Router.patch("/changeuserimage", auth, changeUserImage);
Router.post("/removeprofile", removeProfile);

// contacts route
Router.post("/addcontact", auth, addContact);
Router.post("/deletecontact", auth, deleteContact);
Router.patch("/updatecontact", auth, updateContact);
Router.get("/dashboard", auth, dashboard);

module.exports = Router;
