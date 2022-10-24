const {
  logIn,
  logOut,
  update,
  uploadImage,
  verifyUser,
  reVerifyUser,
} = require("../services/authService");
const authService = require("../services/authService");
const { createError } = require("../helpers/errors");

const signUpController = async (req, res, next) => {
  const { body } = req;
  const { token, email, subscription } = await authService.signUp(body);
  return res.json({
    status: "success",
    code: 201,
    token,
    user: { email, subscription },
  });
};

const logInController = async (req, res, next) => {
  const { body } = req;
  const token = await logIn(body);
  res.json({
    status: "success",
    code: 200,
    data: token,
  });
};

const logOutController = async (req, res, next) => {
  await logOut(req.user._id);
  res.sendStatus(204);
};

const getCurrentController = (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: { email, subscription },
  });
};

const updateController = async (req, res, next) => {
  const { subscription } = req.body;
  const subs = ["starter", "pro", "business"];
  if (!subs.includes(subscription)) {
    next(createError(400, "Wrong type of subscription"));
  }
  await update(req.user._id, subscription);
  res.json({
    status: "success",
    code: 200,
    data: { subscription },
  });
};

const imageUploadController = async (req, res, next) => {
  const { path, filename } = req.file;
  const { _id } = req.user;
  const avatarURL = await uploadImage(path, filename, _id);
  res.json({
    status: "success",
    code: 200,
    data: { avatarURL },
  });
};

const getVerifyContoller = async (req, res, next) => {
  const { verificationToken } = req.params;
  const isValid = await verifyUser(verificationToken);
  if (!isValid) {
    next(createError(404, "User not found"));
  }
  res.json({
    status: "success",
    code: 200,
    message: "Verification successful",
  });
};

const getReVerifyContoller = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    next(createError(400, "Missing required field email"));
  }
  await reVerifyUser(email);
  res.json({
    status: "success",
    code: 200,
    message: "Verification email sent",
  });
};

module.exports = {
  signUpController,
  logInController,
  logOutController,
  getCurrentController,
  updateController,
  imageUploadController,
  getVerifyContoller,
  getReVerifyContoller,
};
