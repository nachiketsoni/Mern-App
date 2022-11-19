const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReview,
  deleteProductReview,
} = require("../Controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");

/* GET all products  USER */
router.get("/products", getAllProduct);

/* POST create product. ADMIN */
router.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizedRoles("admin"),
  createProduct
);

/* PUT create product. ADMIN */
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

/* GET create product. USER */
router.route("/product/:id").get(getProductDetails);

/* PUT Review. USER | GET all Review. USER  */
router.route("/review").put(isAuthenticatedUser, createProductReview);
router
  .route("/reviews")
  .get(getProductReview)
  .delete(isAuthenticatedUser, deleteProductReview);

module.exports = router;
