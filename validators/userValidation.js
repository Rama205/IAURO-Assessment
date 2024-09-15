const Joi = require("joi");

const signUpValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    mobile: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Mobile number must be a valid Indian number starting with 6, 7, 8, or 9 and contain 10 digits",
        "any.required": "Mobile number is required",
      }),
  });

  const { error } = schema.validate(req.body);

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

const signInValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body);

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

const userIdValidation = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().length(24).hex().required(),
  });

  const { error } = schema.validate(req.params);
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

const updateUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100),
    email: Joi.string().email(),
    mobile: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .messages({
        "string.pattern.base":
          "Mobile number must be a valid Indian number starting with 6, 7, 8, or 9 and contain 10 digits",
      }),
      isDeleted: Joi.number().valid(0, 1),
      status: Joi.number().valid(0, 1)
  }).min(1);

  const { error } = schema.validate(req.body);
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

module.exports = {
  signUpValidation,
  signInValidation,
  userIdValidation,
  updateUserValidation,
};
