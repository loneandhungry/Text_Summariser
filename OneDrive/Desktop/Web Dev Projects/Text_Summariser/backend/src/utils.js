import axios from "axios";
import dotenv from "dotenv";
dotenv.config({path: "../.env.local"});
const KEY = process.env.HUGGING_FACE_API;

function getLength(l){
    if(l === "s") return 50;
    if(l === "m") return 100;
    return 200;
}

export async function  generateSummary(text,length){
      const max_length = getLength(length);
      try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            { inputs: text , parameters : {max_length}},
            { 
                headers: {
                    Authorization: `Bearer ${KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
     ) ;

     if(!response.data ||  !Array.isArray(response.data) || !response.data[0]?.summary_text){
        throw new Error("Empty or invalid response from HuggingFace API.");
     }

     const summary = response.data[0].summary_text;
     return summary;
    } catch (err) {
    console.error("Hugging Face Generate Summary API Error:", err.message);
    return "Error in generating summary. Please try again.";
  }
    }