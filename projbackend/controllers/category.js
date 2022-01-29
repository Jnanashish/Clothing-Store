const Category = require("../models/category");


exports.getCategoryById = (req, res, next, id) =>{
    Category.findById(id).exec((err, category) => {
        if(err){
            return res.status(400).json({
                error : "Category Not found in db"
            })
        }
        req.category = category;
    })
    next();
}


exports.createCategory = (req, res) =>{
    const category = new Category(req.body);
    category.save((err, category) =>{
        if(err){
            return res.status(400).json({
                error : "Category Not found in db"
            })
        }
        res.json({category});        
    })
    
}


// get a single category
exports.getCategory = (req, res) =>{
    return res.json(req.category)
}

// get all the categories
exports.getAllCategory = (req, res) =>{
    Category.find().exec((err, categories)=>{
        if(err){
            return res.status(400).json({
                error: "No categories found"
            })
        }
        res.json(categories);
    })
}

exports.updateCategory= (req, res) =>{
    const category = req.category;
    category.name = req.body.name;

    Category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to update categories"
            })
        } 
        res.json(updatedCategory)       
    })
}

exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Failed to Delete this category"
            })
        }
        res.json({
            message : "Sucessfully delete",
        })
    });
}