const express = require('express');
const router = express.Router();
const passport = require("../utilis/passport");
const { verifyTokens, profileController,fetchSubscriptionStatus } = require('../utilis/googleStrategy');
const User = require("../models/userModels")
// Route to start Google authentication
router.route('/google')
.get(passport.authenticate("google",{scope:[  
    "email",
     "profile",
     "https://www.googleapis.com/auth/youtube.readonly",
     "https://www.googleapis.com/auth/youtube.force-ssl",      
      ]}),(req,res)=>{});

// Route to handle the Google callback after authentication
router.route('/google/callback')
.get(passport.authenticate("google",{failureRedirect:"/auth/failed"}),async(req,res)=>{
    
    const user = await req.user;
    
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=`+user.token);
});

router.route('/subscriptions')
.get(fetchSubscriptionStatus);

router.route("/dashboard")
.get(async(req,res)=>{
    if(!req.isAuthenticated){
       return res.send("You cannot access because you are not authenticatated")
    }
    return res.send("<h1>This is Dashboard</h1>")
})

router.route("/success")
.get(function(req,res){
    res.send({token:req.query?.token})
})


router.route("/failed")
.get(function(req,res){
     res.send("Authentication Failed")
})

router.route('/profile')
.get(verifyTokens,profileController);


module.exports = router;
