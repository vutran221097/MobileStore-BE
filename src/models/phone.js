const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    }
})

//new collection
const phoneList = new mongoose.model("phoneList",phoneSchema)

module.exports = phoneList;
