const { User } = require("../schemas/userSchema");
const bcrypt = require("bcryptjs");
const { createError } = require("../helpers/errors");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;
const uuid = require("uuid");
const sendEmail = require("./emailService");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const signUp = async ({ email, password }) => {
  console.log("secret_key:", SECRET_KEY);
  const data = await User.findOne({ email });
  if (data) {
    throw createError(409, "Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "404" }, true);
  const verificationToken = uuid.v4();
  const user = await User.create({
    email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });
  const payload = { id: user._id, email, subscription: user.subscription };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );
  await sendEmail(email, verificationToken);
  return updatedUser;
};

const logIn = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw createError(401, "User not verified");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw createError(401, "Email or password is wrong");
  }
  const payload = { id: user._id, email, subscription: user.subscription };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  return token;
};

const logOut = async (id) => {
  await User.findByIdAndUpdate(id, { token: null });
};

const update = async (id, sub) => {
  await User.findByIdAndUpdate(id, { subscription: sub });
};

const uploadImage = async (filePath, name, id) => {
  const newPath = path.resolve(`./public/avatars/${name}`);
  const avatarURL = `/avatars/${name}`;
  const image = await Jimp.read(filePath);
  try {
    await image.resize(250, 250);
    await image.writeAsync(newPath);
    await User.findByIdAndUpdate(id, { avatarURL });
    return avatarURL;
  } catch (err) {
    return err;
  } finally {
    await fs.unlink(filePath);
  }
};

const verifyUser = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return false;
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });
  return true;
};

const reVerifyUser = async (email) => {
  const user = await User.findOne({ email });
  if (user.verify) {
    throw createError(400, "Verification has already been passed");
  }
  await sendEmail(email, user.verificationToken);
  return true;
};

const authenticate = async (token) => {
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    return user.token === token ? user : null;
  } catch (err) {
    return null;
  }
};

module.exports = {
  signUp,
  logIn,
  logOut,
  update,
  uploadImage,
  verifyUser,
  reVerifyUser,
  authenticate,
};
