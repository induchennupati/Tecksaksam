const express=require("express");
const bodyparser=require("body-parser")
const multer=require("multer")
const profile=express.Router()
const sql=require("mysql");
const fs=require("fs");
let conn=require("./dbConnection.js")

module.exports=profile

profile.use(express.static("./static/frontend"))
profile.use(bodyparser.urlencoded({"extended":false}))
profile.use(multer({"dest":"./resume"}).any())




profile.post("/addProfile",function(req,res){
	console.log(req.body);
	var details=req.body;
	var totalDetails=[details.idNumber,details.firstName,details.lastName,details.mobile,details.birthDate,details.address,details.marks10,details.marks12,details.marksBtech];
	conn.query("insert into profile values(?,?,?,?,?,?,?,?,?)",totalDetails,function(err){
		if(err) console.log(err);
	})
	fs.readFile(req.files[0].path,function(err,data){
		if(err) console.log(err)
		else{
			fs.writeFile(__dirname+"/resume/"+req.body.idNumber+".pdf",data,function(err){
				if(err) console.log(err)
				else {fs.unlink(req.files[0].path,function(err){
					if(err) console.log(err);
					else res.sendFile(__dirname+"/static/frontend/home.html");	
				}
				);}
			})
		}
	})
})
