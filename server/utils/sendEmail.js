const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
const {hashString} = require("../utils/index");
const Verification = require('../models/emailVerification');

dotenv.config();

const {AUTH_EMAIL, AUTH_PASSWORD, APP_URL} = process.env;


let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  }
});


const sendVerificationEmail = async(user, res) => {
  const {_id, email, firstName} = user;

  const token = _id + uuidv4();

  const link = APP_URL + "users/verify/" + _id + "/" + token;

  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333333;">Hello ${firstName},</h2>
        <p style="color: #333333;">Thank you for signing up. Please click the link below to verify your email address:</p>
        <p style="color: #333333;"><a href="${link}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; display: inline-block; border-radius: 5px;">Verify Email</a></p>
        <p style="color: #333333;">If you didn't create an account, you can safely ignore this email.</p>
        <p style="color: #333333;">Best regards,<br>Your Company Name</p>
      </div>
    `
  };
  

  try {
    const hashedToken = await hashString(token);

    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    if(newVerifiedEmail){
      transporter
         .sendMail(mailOptions)
         .then(()=>{
          res.status(201).send({
            success: "pending",
            message: 
            "verification email has been sent to your account check your email"
          });
          
         })
    }

   } catch (error) {
    console.log(error);
    res.status(404).json({message: "something went wrong"});
  }

};



module.exports = {sendVerificationEmail};