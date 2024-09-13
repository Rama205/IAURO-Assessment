const router = require("express").Router();
const ensureAuthenticated = require("../middlewares/authValidation");
const userController = require("../controllers/userController");
const {
  signUpValidation,
  signInValidation,
} = require("../validators/userValidation");
const { nonAdminAuth } = require("../middlewares/adminAuth");
const { productValidation } = require("../validators/productValidation");

//User and Admin creation
router.post("/signup", signUpValidation, userController.sinupUser);
router.post("/signin", signInValidation, userController.signIn);

//User to create products
router.post(
  "/createProducts",
  productValidation,
  ensureAuthenticated,
  nonAdminAuth,
  userController.insertProducts
);

module.exports = router;
