const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next({
        status: "400 Bad Request",
        code: 400,
        message: `Validate error`,
        data: error,
      });
    }
    next();
  };
};

module.exports = {
  validateRequest,
};
