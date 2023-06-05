var exp=require("express")
const bodyparser=require("body-parser")
var mail=exp.Router()
var nodemailer=require("nodemailer")
const conn=require("./dbConnection.js")

mail.use(exp.json())
mail.use(bodyparser.urlencoded({"extended":false}));
const transporter=nodemailer.createTransport({
	"service":"gmail",
	"auth":{
		"user":"narayanavishnukumar@gmail.com",
		"pass":"iiugunygyfmwszxa"
	}
})

const message={
	"from":"narayanavishnukumar@gmail.com",
	"to":"",
	"subject":"Registration Successful",
	"html":"<h1>This message is from placement cell</h1>",
	"attachments":[
		{
			"filename":"CompanyDetails.pdf",
			"path":"./company/google.pdf"
		}
		]
}

module.exports=mail


function notify(id,res){
	conn.query(`select fulldetails from company where id=${id}`,function(err,data){
		message["attachments"][0].path="./static/frontend/"+data[0].fulldetails;
		transporter.sendMail(message,function(err,info){
			if(err){ return res.json({"status":false,"msg":"unsuccessful registration"});}
			else return res.json({"status":true,"msg":"successful registration"});
		})		
	})
}

mail.post("/main",function(req,res){
	message["to"]=req.body.email;

	conn.query(`select studentId from signup where username='${req.body.email}'`,function(err,data){
		if(err) console.log(err);
		else{
			conn.query(`select companyId from studentAndcompany where studentId='${data[0].studentId}'`,function(err,result){
				if(result.length==0){
					conn.query("insert into studentAndcompany values(?,?)",[data[0].studentId,req.body.companyId],function(err){
					if(err){ return res.json({"status":false,"msg":"unsuccessful registration"});}
					else notify(req.body.companyId,res);
						})
				}
				else{
					if(result[0]["companyId"].includes(req.body.companyId)){
						return res.json({
							"status":false,
							"msg":"already registered"
						})
					}
					companies=result[0]["companyId"]+","+req.body.companyId.toString();
					conn.query(`update studentAndcompany set companyId='${companies}' where studentId='${data[0].studentId}'`,function(err){
					if(err){ return res.json({"status":false,"msg":"unsuccessful registration"});}
					else notify(req.body.companyId,res);
					})
						
				}
			})
		}
	})

})


