const Product = require("../models/product");
const formidable = require("formidable")
const _ = require("lodash")
// include inuilt node.js file system
const fs = require("fs");
const product = require("../models/product");
const { sortBy } = require("lodash");


exports.getProductById = (req, res, next, id) =>{
    Product.findById(id)
    .populate("category")
    .exec((err, product) =>{
        if(err){
            return res.status(400).json({
                error: "Product Not found"
            })
        } 
        req.product = product;
        next();
    });
};


exports.createProduct = (req, res) =>{ 
    let form = new formidable.IncomingForm();
    // keep the file extension as it is
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            })
        }
        // destrustructuring the fields
        const {name, description, price, category, stock} = fields;
        if(!name || !description || !price || !category){
            return res.status(400).json({
                error : "Please include all fields"
            })
        }

        let product = new Product(fields);

        // handle the file
        if(file.photo){
            // file greater then 3mb
            if(file.photo.size > 3*1024*1024){
                return res.json.status(400).json({
                    error : "File size too Big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }

        // save to the DB
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Saving tShirt Failed"
                })
            }             
            res.json(product)
        })
    })
}

// to optimise the response send the photo in different route
exports.getProduct = (req, res) => {
    res.product.photo = undefined;
    return res.json(res.product)
}

// middleware to return photo
exports.photo = (res, req, next) =>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contetType);
        return res.send(req.product.photo.data);
    }
    next();
}


exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the product"
            })
        } 
        res.json({
            message : "Deleted successfully",
            deletedProduct
        })        
    })
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    // keep the file extension as it is
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            })
        }

        // updation of code
        let product = req.product,
        product = _.extend(product, fields)

        // handle the file
        if(file.photo){
            // file greater then 3mb
            if(file.photo.size > 3*1024*1024){
                return res.json.status(400).json({
                    error : "File size too Big!"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }

        // save to the DB
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error: "Saving tShirt Failed"
                })
            }             
            res.json(product)
        })
    })
}

// product listing
exports.getAllProducts = (req, res) =>{
    // if user set the limit convert it to int
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    // dont select the images
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error: "NO Product found"
            })
        }
        res.json(products)        
    })
}