import express,{Request,Response} from "express"


const app = express();


app.get("/",(req:Request,res:Response)=>{
    res.send("this is home page14")
})



app.listen(7879,()=>{
    console.log("server is listen at 7879")
})