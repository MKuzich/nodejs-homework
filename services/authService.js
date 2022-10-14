const { User } = require("../schemas/userSchema");
const bcrypt = require("bcryptjs");
const { createError } = require("../helpers/errors");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "secretsalt";

const signUp = async ({ email, password }) => {
  const data = await User.findOne({ email });
  if (data) {
    throw createError(409, "Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });
  return user;
};

const logIn = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, "Email or password is wrong");
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

const authenticate = async (token) => {
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    return user.token === token ? user : null;
  } catch (err) {
    return null;
  }
};

module.exports = { signUp, logIn, logOut, update, authenticate };
