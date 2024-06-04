require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const dbConnect = require("./server/config/dbConnect");
const methodOverride = require("method-override");
const cors = require('cors')
const { v4:uuidv4 } = require('uuid');

const PORT = 4000;

const app = express();

// app.use(cors())
app.use(cors({
  origin:'http://localhost:5173',
  credentials: true
}));

dbConnect();
app.use(express.static("./server/public"))
app.set("view engine", "ejs");
app.set("views", "./server/views");

/* session middlewares */
app.use(cookieParser());

app.use(
  session({
    genid:(req)=>{
      return uuidv4();
    },
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DB_ATLAS_URL }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

/* data middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

/* routers */
// main -> community로 변경할 것
app.use("/", require("./server/routes/main/rootRoutes"));
app.use("/myPage", require("./server/routes/main/mypageRoutes"));
app.use("/community", require("./server/routes/community/mainRoutes"));
app.use("/informations", require("./server/routes/information/infoRoutes"))
app.use("/devices", require("./server/routes/deviceguide/kioscRoutes"))

app.listen(PORT, () => {
  console.log(`Server listening from http://localhost:${PORT}`);
});
