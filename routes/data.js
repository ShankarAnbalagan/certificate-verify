var express = require('express');
var router = express.Router();
var jwt=require('jsonwebtoken');
var logincheck=require('./../middleware/logincheck');
var certificate=require('./../models/virtualCertificate');
var multer = require('multer');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post('/add',logincheck(),async function(req,res,next){
    var data=req.body.data;
    var result=new Array();
    if(typeof(data)==='string')
        data=JSON.parse(data);
    

    var promise=data.map(d => {
        return new Promise((resolve,reject)=>{
            certificate.create(
                {
                    usn:d['USN'],
                    fname:d['First Name'],
                    lname:d['Last Name'],
                    year:d['Year'],
                    sem:d['sem'],
                    projectName:d['Project Name'],
                    category:d['Category'],
                    dateOfIssue:d['Date of Issue']
                },
                function(err,createdData){
                if(err) console.log("Data insertion error --> ",err);
                else{
                    var token=jwt.sign({id:createdData['_id']},process.env.JWT_TOKEN);
                    d['verifyUrl']=process.env.GLOBAL_URL+'/data/verify/'+token;
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


router.post('/add-files',upload.single('file'),logincheck(),function(req,res,next){
    var content=req.file.buffer.toString('utf8');

    var rows=content.split('\r\n');

    var json_data=[];
    for(var i=1;i<rows.length-1;i++){
        var values=rows[i].split(',');
        json_data.push({
            'USN':values[0],
            'First Name':values[1],
            'Last Name':values[2],
            'Year':values[3],
            'sem':values[4],
            'Project Name':values[5],
            'Category':values[6],
            'Date of Issue':values[7]
        }); 
    }
    //console.log(json_data);    
    

    var data=json_data;
    var result=new Array();
    if(typeof(data)==='string')
        data=JSON.parse(data);
    

    var promise=data.map(d => {
        return new Promise((resolve,reject)=>{
            certificate.create(
                {
                    usn:d['USN'],
                    fname:d['First Name'],
                    lname:d['Last Name'],
                    year:d['Year'],
                    sem:d['sem'],
                    projectName:d['Project Name'],
                    category:d['Category'],
                    dateOfIssue:d['Date of Issue']
                },
                function(err,createdData){
                if(err) console.log("Data insertion error --> ",err);
                else{
                    var token=jwt.sign({id:createdData['_id']},process.env.JWT_TOKEN);
                    d['verifyUrl']=process.env.GLOBAL_URL+'/data/verify/'+token;
                    result.push(d);
                    resolve();                    
                }
            });
        });
    });

    Promise.all(promise).then(()=>{        
        // res.status(200).json({
        //     status:'success',
        //     data:{
        //         message:'Data insertion successful',
        //         result:result
        //     }
        // });
        res.set({"Content-Disposition":"attachment; filename=verify.txt"});
        res.status(200).send(JSON.stringify(result));
    }).catch(console.log('Some error'));
});


router.get('/verify/:id',function(req,res,next){
    var _id;
    try{
        _id=jwt.verify(req.params.id,process.env.JWT_TOKEN).id;
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
    }
    catch{
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