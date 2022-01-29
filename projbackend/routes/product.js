const express = require("express");
const router = express.Router;

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {getProduct, photo, deleteProduct, updateProduct, getAllProducts} = require("../controllers/product")


router.param("userId", getUserById);
router.param("productId", getProductById);

// routes
router.post("/product/create/:userid", isSignedIn, isAuthenticated, isAdmin, createProduct)
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
router.get("/product", getAllProducts);

// delete route
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, getProduct, deleteProduct);

// update product
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, getProduct, updateProduct);


module.exports = router;