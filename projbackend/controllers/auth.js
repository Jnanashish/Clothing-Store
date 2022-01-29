const { validationResult } = require("express-validator");
const User = require("../models/user");
var jwt = require("jsonwebtoken");
var expressjwt = require("express-jwt"); 

// during the signout just clear the cookie
exports.signout = (req, res) =>{
    // remove the token with key "token" from local storage
    res.clearCookie("token");
    res.json({
        message : "User Signout successfully",
    })
};

exports.signup = (req, res) =>{ 
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            // convert the errors to array
            error : errors
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in db"
            })
        } 
        res.json(user);
    })
};

exports.signin = (req, res) =>{
    const errors = validationResult(req)
    
    const {email, password} = req.body;
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }
    // exact the very first one data
    User.findOne({email}, (err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error : "USER email doesnt exist",
            });
        }
        // method from user model to match the passwords
        if(!user.autheticate(password)){
            return res.status(401).json({
                error : "Email and password do not match",
            })
        }

        // if all clear signin the user create a token and put in cookie
        const token = jwt.sign({_id: user._id}, process.env.SECRET)

        // put token in cookie (Cookie is like a key value pair)
        res.cookie("token", token, {expire : new Date() + 9999})

        // send response to frontend
        const {_id, name, email, role} = user;
        // frontend will store the token in local storage
        return res.json({token, user:{_id, name, email, role}});
    })
}

// protected routes
// function to check if user is signed in or not, check for token
exports.isSignedIn = expressjwt({
    secret : process.env.SECRET,
    // auth will be added in the response
    userProperty : "auth"
})

// custom middleware 
exports.isAuthenticated = (req, res, next) =>{
    // profile is set by frontend, auth is set by isSignedIn middleware
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error : "ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) =>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error : "You are not Admin, Access Denied"
        })        
    }
    next();
}

