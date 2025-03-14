const mongoose = require("mongoose");

const AppliedSchema = new mongoose.Schema({
    userId :{
        type : String,
        required:true
    },
    id :{
        type:Number,
        required:true
    },
    profile_name:{
        type:String,
        required:true
    },
    company_name:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    }
})

const appliedOppertunity = mongoose.model("appliedOppertunity",AppliedSchema);
module.exports = appliedOppertunity;