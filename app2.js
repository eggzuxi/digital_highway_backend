const express = require('express');
const dbConnect = require('./server/config/dbConnect')
const cors = require('cors')

const app = express()
app.use(cors())
// app.set("view engine", "ejs");//ejs 모듈 사용
// app.set("views", "./views");

const port = 3000;
dbConnect();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/informations", require("./server/routes/information/infoRoutes"))
app.use("/devices", require("./server/routes/deviceguide/kioscRoutes"))

app.listen(port, ()=>{
  console.log("서버시작!")
})