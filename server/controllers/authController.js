const Users = require("../models/userModel");
const { hashString, compareString, createJWT } = require("../utils/index");
const { sendVerificationEmail } = require("../utils/sendEmail");

const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return next("Provide required fields");
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      return next("Email Address already exists");
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
    res.status(404).json({ message: err.message });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return next("Please provide user credentials");
    }

    // Find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    if (!user) {
      return next("Invalid email or password");
    }

    if (!user.verified) {
      return next(
        "User email is not verified. Check your email account and verify your email"
      );
    }

    // Compare password
    const isMatch = await compareString(password, user.password);

    if (!isMatch) {
      return next("Invalid email or password");
    }

    user.password = undefined;

    const token = createJWT(user._id);

    res.status(201).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = { register, login };
