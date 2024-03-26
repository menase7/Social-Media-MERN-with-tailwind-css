const Users = require("../models/userModel");
const { hashString } = require("../utils");
const { sendVerificationEmail } = require("../utils/sendEmail");


const register = async (req, res, next) => {
  const {firstName, lastName, email, password} = req.body;
  
   if(!(firstName || lastName || email || password)){
    next("provide required fields");
   }

   try {
    
    const userExist = await Users.findOne({ email });

    if(userExist){
      next("Email Address already exists");
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    //send email verification to user
    sendVerificationEmail(user, res);

   } catch (err) {
    console.log(err);
    res.status(404).json({message: err.message});
   }

}


module.exports = {register};