var User=require('./../models/Users');

module.exports=function(){
    return function(req,res,next){
        User.findOne({userName:'admin', isLoggedIn:true},function(err,data){
            if(data)
                next();
            else{
                res.status(422).json({status:'fail',data:{message:"User not logged in or does not exist"}});
            }
        });
    };
};