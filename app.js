require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const dbConnect = require("./server/config/dbConnect");
const methodOverride = require("method-override");

const PORT = 4000;

const app = express();
dbConnect();
app.use(express.static("./public"))
app.set("view engine", "ejs");
app.set("views", "./views");

/* session middlewares */
app.use(cookieParser());

app.use(
  session({
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
app.use("/", require("./server/routes/community/rootRoutes"));
app.use("/community", require("./server/routes/community/mainRoutes"));

app.listen(PORT, () => {
  console.log(`Server listening from http://localhost:${PORT}`);
});
