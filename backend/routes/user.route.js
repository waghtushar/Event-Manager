const express = require("express");
const { register, login, getUserProfile } = require("../controllers/user.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/profile",protect, getUserProfile);

module.exports = userRoutes;