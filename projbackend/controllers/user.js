const User = require("../models/user")
const Order = require("../models/order")

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error : "No user found in DB"
            })
        }
        req.profile = user
        next();
    }) 
}


exports.getUser = (req, res) => {
    // for security reason make it undefined
    // undefined items are not shown in json format in frontend
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile)
}


// exports.getAllUser = (req, res) => {
//     User.fing().exec((err, users) => {
//         if(err || !users){
//             return res.status(400).json({
//                 error : "No User found"
//             })
//         }
//         // if sucess return all the users
//         res.json(users);
//     })
// }


exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set : req.body},
        {new : true, useFindAndModify : false},
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error: "You are not auth user"
                })
            }
            req.user.salt = undefined;
            req.user.encry_password = undefined;
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req, res) => {
    // find in Order collection with the specific id (from a particular user) in user key
    Order.find({user: req.profile._id})
    // get _id and name from the reference collection userSchema
    .populate("user", "_id name")
    .exec(() => {
        if(err, order){
            return res.status(400).json({
                error : "No Order in this account"
            })
        }
        return res.json(order)
    })
}

// push data to purchases list of user schema
exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = []
    req.body.order.products.forEach(product => {
        // push object with info about the order
        purchases.push({
            _id : product._id,
            name: product.name,
            description : product.description,
            category : product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id,
        })
    })
    //store purchases list in db
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true}, //send the updated values
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
            next();
        }
    )
    next();
}