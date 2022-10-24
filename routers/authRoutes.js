const express = require("express");
const {
  signUpController,
  logInController,
  logOutController,
  getCurrentController,
  updateController,
  imageUploadController,
  getVerifyContoller,
  getReVerifyContoller,
} = require("../controller/authController");
const { validateRequest } = require("../middlewares/validateRequest");
const { userSchema } = require("../schemas/userSchema");
const { auth } = require("../middlewares/authValidate");
const upload = require("../middlewares/upload");
const ctrlWrapper = require("../helpers/ctrlWrapper");

const router = express.Router();

router.post(
  "/signup",
  validateRequest(userSchema),
  ctrlWrapper(signUpController)
);

router.post(
  "/login",
  validateRequest(userSchema),
  ctrlWrapper(logInController)
);

router.post("/logout", auth, ctrlWrapper(logOutController));

router.get("/current", auth, ctrlWrapper(getCurrentController));

router.patch("/", auth, ctrlWrapper(updateController));

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  ctrlWrapper(imageUploadController)
);

router.get("/verify/:verificationToken", ctrlWrapper(getVerifyContoller));

router.post("/verify/", ctrlWrapper(getReVerifyContoller));

module.exports = router;
