require('dotenv').config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const fileupload=require("express-fileupload")
const app = express();

const port = process.env.PORT || 5000;
require("./database/connect");

// configuring the cloudinary 
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
  });

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials:true
}));
app.use(cookieParser());
app.use(fileupload({
    useTempFiles: true,
    limits:{fileSize:1000000}
}))

// importing the contact routes
const route = require("./route/contactRoute");

app.use("/", route);

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})