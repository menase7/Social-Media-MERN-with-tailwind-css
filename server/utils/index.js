const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashString = async (useValue) =>{
  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(useValue, salt);
  return hashPassword;
};


const compareString = async (userPassword, password)=>{
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

const createJWT= (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d"
  })
}



module.exports = {hashString, compareString, createJWT}