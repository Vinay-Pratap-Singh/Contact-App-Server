const mongoose = require("mongoose");
const db = process.env.MONGO_URL;

try {
    mongoose.connect(db, (error) => {
        if (error) console.log("Database Connection Failed");
        else console.log("Database Connected");
    });
    
} catch (error) {
    console.log("Database Connection Failed\n", error);
}