const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String, 
        trim: true,
        required: true,
        maxlength: 32,
    },
    description: {
        type: String, 
        trim: true,
        required: true,
        maxlength: 2000,        
    },
    price: {
        type: Number, 
        required: true,
        maxlength: 32,         
    },
    // every product should have a category and its connected to the category schema
    category: {
        type: ObjectId,
        ref: "Category", 
        required: true
    },
    stock: {
        type: Number,
    },
    sold: {
        type: Number,
        default: 0
    },
    // store images
    photo: {
        data: Buffer,
        contentType: String
    }
},{timestamps: true});


module.exports = mongoose.model("Product", productSchema);