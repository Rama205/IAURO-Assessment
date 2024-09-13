const router = require("express").Router();
const ensureAuthenticated = require("../middlewares/authValidation");
const productController = require("../controllers/productController");
const pageValidation = require("../validators/paginationValidation");

router.get(
  "/productsList",
  pageValidation,
  ensureAuthenticated,
  productController.getVisibleProducts
);

module.exports = router;
