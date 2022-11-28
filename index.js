require('dotenv').config();
const cors = require("cors");
const express = require("express");
const app = express();

const port = process.env.PORT || 5000;
require("./database/connect");

app.use(express.json());
app.use(cors({
    origin: "netlify"
}));

// importing the contact routes
const route = require("./route/contactRoute");

app.use("/", route);

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})