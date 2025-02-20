import express from "express";
import mongoose from "mongoose";
import { userRoutes } from "./routes/userRoutes.js";
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http";
import {Server} from "socket.io"
import user from "./models/userModel.js";
dotenv.config();
const app=new express();
const server=http.createServer(app);

const router= express.Router();
const io=new Server(server,{
    cors: {
      origin: ["https://el-lotteriafrontend.vercel.app","http://localhost:5173","http://localhost:5174"], 
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
    },
    allowEIO3: true
  }); 

mongoose.connect(process.env.MONGO_PASSWORD);

const db=mongoose.connection;


db.on("open",()=>{
    console.log("connection success");
});


db.on("error",()=>{
    console.log("connection unsuccess");
});

app.use(cors({
    origin:["https://el-lotteriafrontend.vercel.app","http://localhost:5173","http://localhost:5174"], 
    credentials:true,       
    optionSuccessStatus:200,
 }));
app.use(express.json());

userRoutes(app);


server.listen(4000,()=>{
    console.log("server is running at port 4000");
});
io.on("connection",(socket)=>{
    console.log("user connected " + socket.id);


    socket.on("join_room",(data)=>{
        socket.join(data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
})

const changeEvent=user.watch();

changeEvent.on('change', async (change) => {

    if (change.operationType === 'update') {
      const documentId = change.documentKey._id; 

      try {
        const updatedDoc = await user.findById(documentId);
        if (updatedDoc) { 

        const arr=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8]];
        let x=1;
        let arrays=[updatedDoc.userOne,updatedDoc.userTwo]
        for(let holder of arrays){
            for(let e of arr){
                if(holder[e[0]]=="X"&&holder[e[1]]=="X"&&holder[e[2]]=="X"){
                    io.to(updatedDoc._id.toString()).emit('receive_message',`User ${x} Won`);
                    return;
                }
            }
            x=x+1
        }
        }
      } catch (err) {
        console.error("Error getting updated document:", err);
      }
    }
  });