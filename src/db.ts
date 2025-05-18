import mongoose from"mongoose"

mongoose.connect("Yaha aapna daalo")

const userSchema = new mongoose.Schema({
    username : {type : String , unique:true},
    password : {type : String }
})

export const userModel = mongoose.model("User",userSchema);

const contentSchema = new mongoose.Schema({
    title:{type : String},
    link : {type : String},
    tags :[{type:mongoose.Types.ObjectId, ref:"tag"}],
    userId : [{
        type : mongoose.Types.ObjectId,
        ref : "User",
        required :true
    }]
})

export const contentModel = mongoose.model("Content", contentSchema)

const linkSchema = new mongoose.Schema({
    contentId:{
        type:mongoose.Types.ObjectId,
        ref:"Content",
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        reqired:true
    },
    hash:{
        type:String,
        unique:true,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
})

export const linkModel = mongoose.model("Links",linkSchema);