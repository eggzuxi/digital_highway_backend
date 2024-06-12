require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/dbConnect');
const imageUpload = require('./routes/imageUpload');
const postUpload = require('./routes/postUpload');

const app = express();
dbConnect();

// 정적 파일 제공
app.use(express.static('./public'));

// Middleware
app.use(cors());
app.use(express.json());

// Use Routes
app.use('/api/images', imageUpload);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server started on port ${port}`));
