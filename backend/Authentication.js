const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const express=require("express")
const bodyparser=require("body-parser")
const sql=require("mysql")
const Authenticate=express.Router()
module.exports=Authenticate

Authenticate.use(express.static("./static"))
Authenticate.use(express.json());
Authenticate.use(bodyparser.urlencoded({"extended":false}));

const conn=require("./dbConnection.js");

Authenticate.post("/signin",function(req,res){
		//console.log(req.body);
		var username=req.body.user;
		var password=req.body.pass;
	/*		conn.connect(function(err){
				if(err) console.log(err);
				else{*/
					conn.query(`select * from signup where username='${username}'`,function(err,results){
						if(err) {console.log("failure")}
						else if(results.length==0) return res.json({"status":false})
						else{
							var ret=bcrypt.compareSync(password.toString(),results[0]["password"]);
							if(ret) return res.json({"status":true,"username":username,"id":results[0]["studentId"]})
							else return res.json({"status":false})
						}	
				}
				)
				/*}		
			})	*/	
	})
	
Authenticate.post("/signup",function(req,res){
	console.log(req.body);
	let user=req.body.user;
	let id=req.body.id;
	let password=req.body.pass;
	let retyped=req.body.retype;
	if(user.length>0 && password.length>0 && retyped.length>0){
		if(password===retyped){
			db_password=bcrypt.hashSync(password,10);
			db_username=user;
			/*conn.connect(function(err){
				if(err) console.log(err);
				else{*/
					conn.query(`insert into signup values(?,?,?)`,[db_username,db_password,id],function(err){
						if(err) return res.json({"status":false})
						else{ return res.json({"status":true})
						}
					})
			/*	}
			})*/
		}
	}
})



