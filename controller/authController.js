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
  try {
    const { token, email, subscription } = await authService.signUp(body);
    return res.json({
      status: "success",
      code: 201,
      token,
      user: { email, subscription },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const logInController = async (req, res, next) => {
  const { body } = req;
  try {
    const token = await logIn(body);
    res.json({
      status: "success",
      code: 200,
      data: token,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const logOutController = async (req, res, next) => {
  try {
    await logOut(req.user._id);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    next(err);
  }
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
  try {
    await update(req.user._id, subscription);
    res.json({
      status: "success",
      code: 200,
      data: { subscription },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
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
  try {
    const isValid = await verifyUser(verificationToken);
    if (!isValid) {
      next(createError(404, "User not found"));
    }
    res.json({
      status: "success",
      code: 200,
      message: "Verification successful",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getReVerifyContoller = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    next(createError(400, "Missing required field email"));
  }
  try {
    await reVerifyUser(email);
    res.json({
      status: "success",
      code: 200,
      message: "Verification email sent",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
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
