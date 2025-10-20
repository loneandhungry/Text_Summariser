import express from "express";
import {summarizeText} from "./control.js";
import jwt from "jsonwebtoken";
import cors from "cors"
import { OAuth2Client } from "google-auth-library"
import {limiter} from "./control.js";
import { verify } from "./authMiddlewares.js";
import multer from "multer";
import { PDFParse } from "pdf-parse";

const route = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

route.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

route.get("/",(req,res)=>{
    res.send("YAYY");
})

const storage = multer.memoryStorage();
const upload = multer( { storage : storage });


route.post("/summarise",verify,limiter,upload.single("file"),async(req,res)=>{
     let text = req.body.text || null;
     if(req.file){
        try{
        const data = await PDFParse(req.file.buffer);
        text = data ;
        } catch (err){
            res.send("Failed to parse PDF. Upload a smaller one")
        }
     }
     const length = req.body.length;
     const result = await summarizeText(text,length);
     if(result.error){
       return res.send("Please enter a valid string and a valid length optional.");
     }
     res.json({summary : result.summary });
});

route.post("/auth",async(req,res) =>{
    const token = req.body.token; 
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    })
const payload = ticket.getPayload();

const user = {
    id: payload.sub,
    email: payload.email,
    name: payload.name
}

const accesswebtoken = jwt.sign(user, process.env.JWT_SECRET,{
    expiresIn : process.env.JWT_EXPIRES_IN,
})

res.json({ token : accesswebtoken })
});

export default route;
