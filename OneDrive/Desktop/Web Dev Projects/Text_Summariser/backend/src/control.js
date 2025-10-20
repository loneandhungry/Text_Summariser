import zod from "zod";
import express from "express";
import { _enum } from "zod/v4/core";
import { generateSummary } from "./utils.js";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

const schema = zod.object({
    text: zod.string(),
    length : zod.enum(["s","m","l"]),
});
export async function summarizeText(text,length){
     const check = schema.safeParse({text,length});
     if(!check.success){
        return {error : check.error};
     }
     const summary =await generateSummary(text,length);
     return {summary} ;
}

export const limiter = rateLimit({
    windowMs: 20*60*1000,
    limit: 5,
    message: "Too many requests from this IP. Please try again after 20 minutes."
})


