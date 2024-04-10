import dotenv from 'dotenv';

import express from "express";
import connectDB from './db/dbConnect.js';
import app from './app.js'

dotenv.config(
  {
    path : "./.env"
  }
);

const port = process.env.PORT_URL || 4000;

connectDB().then(()=> {
  app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`);
  });
}).catch((error)=>{
    console.log("DB connection failed !!!!",error);
});
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/sanky', (req, res) => {
//   res.send("<h1>Hello Sanky!!!</h1>")
// })

// app.listen(process.env.PORT_URL, () => {
//   console.log(`Example app listening on port ${process.env.PORT_URL}`)
// })