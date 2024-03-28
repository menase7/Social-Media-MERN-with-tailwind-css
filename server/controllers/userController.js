const express = require('express');
const Verification = require('../models/emailVerification.js');
const Users = require('../models/userModel');
const { compareString } = require('../utils/index.js');


const verifyEmail = async (req, res) => {
  const {userId, token} = req.params;

  try {
    const result = await Verification.findOne({userId});

    if(result) {
      const {expiresAt, token:  hashedToken} = result;

      //token has expires
      if(expiresAt < Date.now()){
         Verification.findOneAndDelete({userId})
        .then(()=>{
          Users.findOneAndDelete({_id: userId})
          .then(()=>{
            const message = "verification token has expired.";
            res.redirect(
              `/users/verified?status=error&message=${message}`);
          })
          .catch((err)=>{
            console.log(err);
            res.redirect(`/users/verified?status=error&message=`);
          });
          
        })
        .catch((err)=>{
          console.log(err);
          res.redirect(`/users/verified?message=`);
        });
      }else{
        //token valid
        compareString(token, hashedToken)
        .then((isMatch)=>{
          if(isMatch){
            Users.findOneAndUpdate({_id: userId} , { verified: true})
            .then(()=>{
              Verification.findOneAndDelete({userId}).then(()=>{
                const message = "Email verified successfully";
                res.redirect(
                  `/users/verified?status=success&message=${message}`
                );
              });
            })
          }else{
            const message = "verification failed or link is invalid";
            res.redirect(`/users/verified?status=error&message=${message}`);

          }
        })
        .catch((err)=>{
          console.log(err);
          res.redirect(`/users/verified?message=`);
        });
      }

    }else{
      const message = "Invalid verification link. try again later.";
      res.redirect(`/users/verified?status=error&message=${message}`);
    }


  } catch (error) {
   console.log(err);
   res.redirect(`/users/verified?message=`);
  }
};


module.exports = verifyEmail;