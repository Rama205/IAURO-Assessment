const Joi = require("joi");

const productValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(500).required(),
    price: Joi.number().positive().precision(2).required(),
    quantity: Joi.number().integer().min(1).required(),
    category: Joi.string().min(3).max(100).required(),
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

const productIdvalidation = (req, res, next) => {
  const schema = Joi.object({
    productId: Joi.string().length(24).hex().required(),
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

const updateProductrValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(10).max(500).optional(),
    price: Joi.number().positive().optional(),
    quantity: Joi.number().integer().min(0).optional(),
    category: Joi.string().min(3).max(50).optional(),
    isVisible: Joi.boolean().optional(),
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
  productValidation,
  productIdvalidation,
  updateProductrValidation,
};
