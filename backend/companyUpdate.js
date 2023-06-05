const express=require("express");
const app=express.Router();
const bodyparser=require("body-parser");
const multer=require("multer");
const db=require("./dbConnection.js");
const fs=require("fs");

module.exports=app;

app.use(express.json());
app.use(express.static("./static/frontend"))
app.use(bodyparser.urlencoded({"extended":false}))
app.use(multer({"dest":"./static/frontend/company"}).any())

app.post("/addUpdate",function(req,res){
	var title=req.body.title;
	var id=req.body.id;
	var modifiedTitle=title+id.toString()+"."+req.files[0].mimetype.split("/")[1];
	fs.rename(req.files[0].path,"./static/frontend/company/"+modifiedTitle,function(err){
		if(err) console.log(err);
		else console.log("file uploaded successfully");
	})
	db.query(`insert into companyUpdate values(?,?,?)`,[id,title,modifiedTitle],function(err){
		if(err) console.log(err);
		else console.log("successful insertion of data");
	})
})

app.post("/getUpdate",function(req,res){
	var id=req.body.id;
	db.query(`select heading,data from companyUpdate where id=${id}`,function(err,data){
		if(err){
			return res.json({
				"status":false,
				"data":data
			})
		} 
		else{
			return res.json({
				"status":true,
				"data":data
			})
		}
	})
})


