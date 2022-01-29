const express = require("express");
const router = express.Router();

// import methods from controller
const {getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")

// If there is anything in the route like /user/:id the id param is named as userId
// and a profile is populated with the help of getUserById Middleware
router.param("userId", getUserById);

// getUser will return the profile based on id
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)

// update a user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)
// router.get("/user", getAllUser);


router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)


module.exports = router;

