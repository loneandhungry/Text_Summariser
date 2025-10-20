import dotenv from "dotenv";
dotenv.config({path: "../.env.local"});
import express from "express";
import routes from "./routes.js";


const app = express();
app.use(express.json());


app.use("/",routes);

const port = process.env.PORT ;
app.listen(port, ()=>{
    console.log(`Server started on PORT ${port}`);
})