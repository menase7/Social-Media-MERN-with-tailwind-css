const mongoose = require("mongoose");

 const dbConnection = async () => {
    try{
      const connection = await mongoose.connect(process.env.MONGODB_URL);
      console.log("DB connected successfully");
    } catch (err) {
      console.log("DB Error: "+err)
    }
 }

 module.exports = dbConnection;