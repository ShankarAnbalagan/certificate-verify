var express = require('express');
var router = express.Router();
var logincheck=require('./../middleware/logincheck');
var certificate=require('./../models/virtualCertificate');

router.post('/add',logincheck(),function(req,res,next){
    var data=req.body.data;
    var result=new Array();

    for (d of data){
            certificate.create(d,function(err,createdData){
            if(err) console.log("Data insertion error --> ",err);
            else{
                d['verifyUrl']=process.env.GLOBAL_URL+'/data/verify/'+createdData['_id'];
                console.log(d);
                result.push(d);
            }
        });
    }

    console.log("done");
    res.send("done");
});


router.get('/verify/:id',function(req,res,next){
    var _id=req.params.id;
    if(_id.length===24){
        certificate.findById(_id,function(err,data){
            if(err) console.log('Certificate verification error-->', err);
            else{
                if(data){
                    res.status(200).render('verified');
                }
                else
                res.status(200).render('notverified');
            }
        });
    }
    else{
        res.status(200).render('notverified');
    }
});


module.exports=router;