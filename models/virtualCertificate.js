var mongoose = require('mongoose');

const certificateSchema=mongoose.Schema({
    name1:String,
    usn1:String,
    name2:String,
    usn2:String,
    name3:String,
    usn3:String,
    name4:String,
    usn4:String,
    branch:String,
    sem:String,
    title:String,
    category:String,
    dateOfIssue:Date
});

module.exports=mongoose.model("certificates",certificateSchema);