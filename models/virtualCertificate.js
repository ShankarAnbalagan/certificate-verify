var mongoose = require('mongoose');

const certificateSchema=mongoose.Schema({
    usn:String,
    fname:String,
    lname:String,
    year:Number,
    sem:Number,
    projectName:String,
    category:String,
    dateOfIssue:Date
});

module.exports=mongoose.model("certificates",certificateSchema);