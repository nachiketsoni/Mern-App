const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  getUserProfile,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  changeRole,
  deleteUser,
  isLoggedIn,
} = require("../Controllers/userController");
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");
// POST | Register a user | USER
router.route("/register").post(registerUser);

// POST | Login user | USER
router.route("/login").post(loginUser);

// GET | Isloggedin | USER
router.route("/isLoggedIn").get(isAuthenticatedUser, isLoggedIn);

// GET | Logout a user | USER
router.route("/logout").get(isAuthenticatedUser, logout);

// POST | Forgot URL Email send | USER
router.route("/password/forgot").post(isAuthenticatedUser, forgotPassword);

// PUT | Reset Password | USER
router.route("/password/reset/:token").put(isAuthenticatedUser, resetPassword);

// GET | loggedin User Profile | USER
router.route("/myprofile").get(isAuthenticatedUser, getUserProfile);

// PUT | Update Password | USER
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// GET | Update Profile Details | USER
router.route("/myprofile/update").put(isAuthenticatedUser, updateProfile);

// GET | Get All Users | ADMIN
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUser);

// GET | Get Single User | Change User role | Delete User | ADMIN
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), changeRole)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

module.exports = router;
