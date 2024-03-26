const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');

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
  const {_id, email, lastName} = user;

  const token = _id + uuidv4();

  const link = APP_URL + "users/verify/" + _id + "/" + token;

  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email Verification",
    html: ``
    /*
    write const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email Verification",
    html: ``
  }; html code for email verification sent to the user by nodemailer inside html code there are this vaiables "lastName" and "link" make the html inline style
     */
  };

  try {
    const hashedToken = await hashPassword(token);

    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    })
   } catch (error) {
    console.log(error);
    res.status(404).json({message: "something went wrong"});
  }

};



module.exports = {sendVerificationEmail};