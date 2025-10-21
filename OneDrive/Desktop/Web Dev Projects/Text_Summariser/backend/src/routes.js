import express from "express";
import {chunker, summarizeText} from "./control.js";
import jwt from "jsonwebtoken";
import cors from "cors"
import { OAuth2Client } from "google-auth-library"
import {limiter} from "./control.js";
import { verify } from "./authMiddlewares.js";
import multer from "multer";
import { PDFParse } from "pdf-parse"

const route = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

route.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

route.get("/",(req,res)=>{
    res.send("YAYY");
})
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

route.post("/summarise",verify,limiter,upload.single("file"),async(req,res)=>{
     let text = req.body.text || null ;
    
    if(req.file){
        console.log("File Received");
        try{
            const parser = new PDFParse({data: req.file.buffer});
            const data = await parser.getText();
            await parser.destroy();
        text +="\n" + data.text;

        console.log("File parsed");
        } catch(err){
            console.log(`Not able to parse the pdf : ${err.message}`);
        }
    }



     const length = req.body.length;

     let total = [];
     const chunks = chunker(text);
     for(let i = 0 ; i < chunks.length ; i++){
        let part = await summarizeText(chunks[i],length);
        if(part.error) {continue};
        total.push(part.summary);
     }
     const result =  total.join(" ");

   
     res.json({summary : result });
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
