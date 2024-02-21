import express from "express"
import connectDB from "./db.js"
import { userRouter } from "./router/auth.js"
import { noteRouter } from "./router/notes.js"

const app = express()

app. use(express.json())

const PORT = 8080

app.get("/",(req, res)=>{
    res.send({ message:"iam working"})
})//http://localhost:8080/

//db
connectDB()

app.use("/user", userRouter )
app.use("/notes", noteRouter )



app.listen(PORT,()=>console.log(`server start in localhost:${PORT}`))
