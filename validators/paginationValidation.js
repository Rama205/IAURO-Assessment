const Joi = require("joi");

const pageValidation = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1).required(),
    pageSize: Joi.number().integer().min(1).max(100).default(10).required(),
    searchText: Joi.string().allow(""),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({
      message: "Bad Request",
      error: errorMessage,
    });
  }
  next();
};

module.exports = pageValidation;
