var express = require('express');
var router = express.Router();
var randomstring=require('randomstring');
var userData=require('./../models/Users');

/*POST user login */
router.post('/login', function(req, res, next) {
	var{userName, password}=req.body;

  	userData.findOne({userName},function(err,user){
    	if(err) console.log("Login error");
    	else{
      		if(!user)
				res.status(422).json({status:"fail",data:{message:"User does not exist"}});
			else if(user.isLoggedIn===true)
				res.status(422).json({status:"fail",data:{message:"User already logged in"}});
      		else{
        		if(user.password===password){
					var usertoken=randomstring.generate(10);
					userData.updateOne({userName},{$set:{isLoggedIn:true,userToken:usertoken}},
						function(err){
							res.status(200).json({status:"success",data:{message:"User successfully logged in",userToken:usertoken}});
						});          		
        	}
        	else
        		res.status(422).json({status:"fail",data:{message:"Wrong password"}});
      		}
    	}
  	})
});

/** GET user logout */
router.get('/logout/:usertoken',function(req,res,next){
	var usertoken=req.params.usertoken;
	userData.updateOne({userToken:usertoken},{$set:{userToken:"",isLoggedIn:false}},
	function(err,user){
		if(err) console.log('Logout error');
		else{
			if(user.n===1){
				res.status(200).json({status:"success",data:{message:"User successfully logged out"}});
			}
			else{
				res.status(422).json({status:"fail",data:{message:"User not logged in or token invalid"}});
			}
		}
	});
});

module.exports = router;
