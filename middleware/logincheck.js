var User=require('./../models/Users');

module.exports=function(){
    return function(req,res,next){
        var usertoken=req.body.usertoken;
        User.findOne({userName:'admin', isLoggedIn:true},function(err,data){
            if(data && data.userToken===usertoken)
                next();
            else{
                res.status(422).json({status:'fail',data:{message:"User not logged in or user token invalid"}});
            }
        });
    };
};