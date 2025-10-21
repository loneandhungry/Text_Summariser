import zod from "zod";
import express from "express";
import { _enum } from "zod/v4/core";
import { generateSummary } from "./utils.js";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import multer from "multer";
import { Blob } from "buffer";
import axios from "axios";
import FormData from "form-data";

import dotenv from "dotenv";
dotenv.config({path: "../.env.local"});
const KEY = process.env.PDFREST_API_KEY;


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

export function chunker(text){
    const max = 500;
    let chunks = []; let start = 0, end = null;
    while (start<text.length){
        let end = Math.min(text.length,start+max);
        chunks.push(text.slice(start,end));
        start = end;
    }
    return chunks;
}


export async function TextFromPdf(file, name) {
 const formData = new FormData();

  const blob = new Blob([file] , {type: "application/pdf"});
  formData.append("file", blob,  name  );

  try {
    const response = await axios.post(
      "https://api.pdfrest.com/extracted-text", // Make sure this is the correct endpoint for extracting text
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "Api-Key": process.env.PDFREST_API_KEY,
        },
      }
    );

    return response.data.text;
  } catch (err) {
    console.error(`Error in the API call: ${err}`);
    return null;
  }
}



