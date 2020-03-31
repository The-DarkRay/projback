const User = require("../models/user")
const { check, validationResult } = require('express-validator');
 var jwt =require('jsonwebtoken');
 var expresJwt =require('express-jwt');


exports.signup=(req,res)=>{  
  res.json({
    message: "signup route works!"
  });

const errors = validationResult(req);
 if (!errors.isEmpty()){
   return res.status(422).json({
    error: errors.array()[0].msg

   })
 };


 const user= new User(req.body)
 user.save((error,user)=>{
   if(error){
     return res,status(400).json({
       error: "NOT able to saveuser db"
     })
   };
   res.json({
     name: user.name,
     email: user.email,
     _id: user._id
   });
 });
};

exports.signin=(req,res)=>{
  const errors = validationResult(req); 
const {email, password}= req.body;
if (!errors.isEmpty()){
  return res.status(422).json({
   error: errors.array()[0].msg

  })
}

User.findOne({email}, (error , user)=>{
  if (error || !user){
   return res.status(400).json({
      error: "User email is not found"
    }
    )
  }

  if(!user.authenthicate(password)){
    return res.status(401).json({
      error:"Email and passwor donot match"
    })
    //TOKEN CREATED
    const token = jwt.signin({id: user._id}, process.env.SECERT)
    //put token in cookie
    res.cookie("token" , token , { expire: new Date()+ 9999});
    //send res to frontend
    const {id, name , email,role} = user();
    return res.json({token , user: {id,name , email , role}
    });
  };
});

};




exports.signout = (req, res)=>{
    res.clearCookie("token");
    res.json({
      message : "User signout sucessfully"
    });
  };



  //protection for routes
  exports.isSignedIn=expresJwt({
    secret : process.env.SECERT,
    userProperty: "auth"
  })






  //middlewares