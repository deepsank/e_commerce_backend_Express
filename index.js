import dotenv from 'dotenv';
dotenv.config();
import express from "express";
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/sanky', (req, res) => {
  res.send("<h1>Hello Sanky!!!</h1>")
})

app.listen(process.env.PORT_URL, () => {
  console.log(`Example app listening on port ${process.env.PORT_URL}`)
})