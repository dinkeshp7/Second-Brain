import express from "express"
import jwt from "jsonwebtoken"
import { contentModel, linkModel, userModel } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middlewares";
import { random } from "./utils";
const app = express();

app.use(express.json())

app.post("/api/v1/signup",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    try{
        await userModel.create({username,password});
        res.json({
            message:"User signed up"
        })
    } catch(e){
        res.status(409).json({
            message:"User already exists"
        })
    }
})

app.post("/api/v1/signin",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await userModel.findOne({username,password})
    if(existingUser){
        const token = jwt.sign({id : existingUser._id},JWT_SECRET)
        res.json({token})
    }else{
        res.status(403).json({message : "Incorrect credentials"})
    }
})

app.post("/api/v1/content",userMiddleware,async (req,res)=>{
    const {link , type , title} = req.body;

    await contentModel.create({
        link,
        type,
        title,
        userId: req.userId,
        tags:[]
    })

    res.json({
        message:"Content Added"
    })
})

app.get("/api/v1/content",userMiddleware, async (req,res)=>{
    const userId=req.userId;
    const content = await contentModel.find({userId}).populate('userId',"username")

    res.json(content)
})

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentid;
  try {
    // Only delete if the content belongs to the authenticated user
    const result = await contentModel.deleteOne({ _id: contentId, userId: req.userId });

    if (result.deletedCount === 0) {
       res.status(404).json({ message: "Content not found or not authorized to delete" });
       return;
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/api/v1/brain/share",async (req,res)=>{
    const contentId = req.body.contentId;
    const share = req.body.share;
    const userId = req.userId;

    try{
        if (typeof share !== "boolean") {
            res.status(400).json({
                message :"Invalid share value"
            })
        }

        const content = await contentModel.findOne({_id:contentId,userId})
        if(!content){
             res.status(403).json({
                message : "Unautherized to share this content"
            })
            return
        }

        const token = random

        await linkModel.create({
            contentId,
            token,
            createdBy:userId,
        })
        res.json({
            shareLink : `${req.protocol}://${req.get("host")}/api/v1/share/${token}`
        })
    }catch(e){
        res.status(500).json({
            message : "server error"
        })
    }

})

app.get("/api/v1/brain/:token",async (req,res)=>{
    const {token}=req.params;
    try{
        const shareLink = await linkModel.findOne({token})

        if(!shareLink){
            res.status(404).json({
                message:"Invalid share link"
            })
            return
        }

        if(shareLink.expiresAt < new Date()){
            res.status(410).json({
                message:"Link expired"
            })
            return
        }

        const content = await contentModel.findById({_id : shareLink.contentId})
        if(!content){
            res.status(404).json({
                message:"Content not found"
            })
            return
        }

        const owner = await userModel.findOne({_id: shareLink.userId})
        if(!owner){
            res.status(404).json({
                message : "content owner not found"
            })
            return
        }

        res.json({
            contentOwner:owner?.username,
            sharedContent:content
        })
    }catch(e){
        console.log("share excess error")
        res.status(500).json({
            message:"server error"
        })
    }
})

app.listen(3000,()=>{
    console.log("Server started")
})