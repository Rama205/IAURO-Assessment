const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/adminAuth");
const ensureAuthenticated = require("../middlewares/authValidation");
const pageValidation = require("../validators/paginationValidation");
const {
  userIdValidation,
  updateUserValidation,
} = require("../validators/userValidation");
const {
  productIdvalidation,
  updateProductrValidation,
} = require("../validators/productValidation");

// Admin access to users
router.get(
  "/user/lists",
  pageValidation,
  ensureAuthenticated,
  adminAuth,
  adminController.getAllUsers
);
router.patch(
  "/softDelete/:userId",
  userIdValidation,
  ensureAuthenticated,
  adminAuth,
  adminController.deleteUser
);
router.patch(
  "/updateUser/:userId",
  userIdValidation,
  updateUserValidation,
  ensureAuthenticated,
  adminAuth,
  adminController.updateUser
);

//Admin access to products and Visibility
router.patch(
  "/product/:productId/visibility",
  ensureAuthenticated,
  adminAuth,
  adminController.updateProductVisibility
);
router.patch(
  "/product/softDelete/:productId",
  productIdvalidation,
  ensureAuthenticated,
  adminAuth,
  adminController.softDeleteProduct
);
router.patch(
  "/product/update/:productId",
  productIdvalidation,
  updateProductrValidation,
  ensureAuthenticated,
  adminAuth,
  adminController.updateProduct
);

module.exports = router;
