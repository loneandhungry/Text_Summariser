import  jwt  from "jsonwebtoken";
import express from "express";

export function verify(req,res,next){
    try{
    const header = req.headers.authorization;
    if(!header){
        return res.status(401).json({message: "Token missing"});
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    next();
    }catch(error){
    return res.status(403).json({messgae: "Invalid token"});
}
    }