const express = require("express");
const router = express.Router;

// import controllers
const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory} = require("../controllers/category")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user");
const { createIndexes } = require("../models/category");


router.param("userId", getUserById);
router.param("categoryId", getCategoryById);


router.post(
    "/category/create/:userId",
    isSignedIn, 
    isAdmin,
    isAuthenticated, 
    createCategory
);

router.get("/category/:categoryId", getCategory)
router.get("/categories", getAllCategory)

// update
router.put(
    "/category/:categoryId/:userId",
    isSignedIn, 
    isAdmin,
    isAuthenticated, 
    updateCategory
)

// delete
router.delete(
    "/category/:categoryId/:userId",
    isSignedIn, 
    isAdmin,
    isAuthenticated, 
    removeCategory
)
// export all the router
module.exports = router;