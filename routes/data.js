var express = require('express');
var router = express.Router();
var logincheck=require('./../middleware/logincheck');
var certificate=require('./../models/virtualCertificate');

router.post('/add',logincheck(),async function(req,res,next){
    var data=req.body.data;
    var result=new Array();
    
    // for (d of data){
    //         await certificate.create(d,function(err,createdData){
    //         if(err) console.log("Data insertion error --> ",err);
    //         else{
    //             d['verifyUrl']=process.env.GLOBAL_URL+'/data/verify/'+createdData['_id'];
    //             console.log(d);
    //             result.push(d);
    //         }
    //     });
    // }

    var promise=data.map(d => {
        return new Promise((resolve,reject)=>{
            certificate.create(d,function(err,createdData){
                if(err) console.log("Data insertion error --> ",err);
                else{
                    d['verifyUrl']=process.env.GLOBAL_URL+'/data/verify/'+createdData['_id'];
                    result.push(d);
                    resolve();                    
                }
            });
        });
    });

    Promise.all(promise).then(()=>{        
        res.status(200).json({
            status:'success',
            data:{
                message:'Data insertion successful',
                result:result
            }
        });
    }).catch(console.log('Some error'));

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

router.post('/search',logincheck(),function(req,res,next){
    var fname=req.query.fname;
    var lname=req.query.lname;
    var usn=req.query.usn;
    certificate.find({$or:[{fname},{lname},{usn}]},function(err,docs){
        if(err) console.log("Search error-->", err);
        else{
            if(docs){
                res.status(200).json({status:'success',data:{message:'Search complete', value:docs}});
            }
            else{
                res.status(422).json({status:'fail', data:{message:'Name not found'}});
            }
        }
    });
});


module.exports=router;