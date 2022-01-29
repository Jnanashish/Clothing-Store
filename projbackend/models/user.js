var mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");


// creating the schema
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    userinfo: {
      type: String,
      trim: true
    },
    // store the encrypted password
    encry_password: {
      type: String,
      required: true
    },
    salt: String,     //for password
    role: {
      type: Number,   // higher number more privilage
      default: 0
    },
    purchases: {
      // store the all the purchased item
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

// create a new field named password
userSchema
  .virtual("password")
  // it will update this fields
  .set(function(password) {
    this._password = password;    // password is private variable
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })  // return the value
  .get(function() {
    return this._password;
  });

// return a encrypted password
userSchema.methods = {
   // authenticate the user based on his password
  autheticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function(plainpassword) {
    // empty passwords cannot be stored
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
