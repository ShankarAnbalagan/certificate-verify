var mongoose = require('mongoose');

const userSchema=mongoose.Schema({
    userName:String,
    password:String,
    isLoggedIn:{type:Boolean, default: false},
    userToken:String
});

module.exports=mongoose.model("users",userSchema);