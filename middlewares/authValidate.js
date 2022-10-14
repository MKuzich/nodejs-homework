const { authenticate } = require("../services/authService");
const { createError } = require("../helpers/errors");

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [tokenType, token] = authorization.split(" ");

  if (tokenType !== "Bearer" || !token) {
    next(createError(401, "Not authorized"));
  }
  const user = await authenticate(token);
  if (!user) {
    next(createError(401, "Not authorized"));
  }
  req.user = user;
  next();
};

module.exports = { auth };
