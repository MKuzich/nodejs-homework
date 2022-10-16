const express = require("express");
const {
  signUpController,
  logInController,
  logOutController,
  getCurrentController,
  updateController,
} = require("../controller/authController");
const { validateRequest } = require("../middlewares/validateRequest");
const { userSchema } = require("../schemas/userSchema");
const { auth } = require("../middlewares/authValidate");

const router = express.Router();

router.post("/signup", validateRequest(userSchema), signUpController);

router.post("/login", validateRequest(userSchema), logInController);

router.post("/logout", auth, logOutController);

router.get("/current", auth, getCurrentController);

router.patch("/", auth, updateController);

module.exports = router;
