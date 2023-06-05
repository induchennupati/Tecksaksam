const app=require("express")
const express=require("express");
const bodyparser=require("body-parser")
const multer=require("multer")
const company=express.Router()
const sql=require("mysql");
const fs=require("fs");
const conn=require("./dbConnection.js");

module.exports=company

company.use(app.json());
company.use(express.static("./static/frontend"))
company.use(bodyparser.urlencoded({"extended":false}))
company.use(multer({"dest":"./static/frontend/company"}).any())


company.post("/addCompany",function(req,res){
	let formData=req.body;
	let files=req.files;
	let companyFiles=[]
	console.log(formData);
	for(i in files){
		let oldpath=files[i].path;
		let newpath="/static/frontend/company/"+formData["name"]+"."+files[i].mimetype.split("/")[1];
		companyFiles.push(newpath);
		fs.rename(oldpath,newpath,function(err){
				if(err) console.log(err);
			})
	}
let details=[formData["name"],formData.salary,formData.intern,formData.ppo,formData["description"],companyFiles[0],formData.mainBranch,companyFiles[1]];
	conn.query("insert into company(name,salary,intern,ppo,description,logo,mainBranch,fulldetails) values(?,?,?,?,?,?,?,?)",details,function(err){
		if(err) console.log("MODULE:COMPANY\n"+err);
	})
	})
	
	

	
company.get("/getAllCompanies",function(req,res){
	var date=new Date();
	var dateToday=date.getFullYear().toString()+"-"+(date.getMonth()+1).toString()+"-"+date.getDate().toString()
	let ret={};
	conn.query(`select id,name,logo from company where id in(select id from registrations where registrationDate<'${dateToday}')`,function(err,data){
		ret["completed"]=data;
	})
	conn.query(`select id,name,logo from company where id in(select id from registrations where registrationDate>'${dateToday}' and startDate<'${dateToday}')`,function(err,data){
		ret["active"]=data;
	})
	conn.query(`select id,name,logo from company where id in(select id from registrations where startDate>'${dateToday}')`,function(err,data){
		ret["upcoming"]=data;

	})
	conn.query(`select companyId from studentAndcompany where studentId=${req.query.studentId}`,function(err,data){
		if(err || data.length==0){ret["myCompanies"]=[];return res.json(ret);}
		else{
			var filterData=[]
			var obj={}
			var companies=[]
			data[0]["companyId"].split(",").map(ele=>{
				if(obj[ele]==undefined){
					obj[ele]=ele;
					filterData.push(ele);
				}
			})
			filterData.map((id)=>{
				conn.query(`select id,name,logo from company where id=${id}`,function(err,data){
					companies.push(data[0])
					if(companies.length==filterData.length){
						ret["myCompanies"]=companies;
						return res.json(ret);}	
				})					
			})
			
		}
	})		
	
})


company.post("/getCompanyById",function(req,res){
	//console.log(req.body);
	conn.query(`select * from company where id=${req.body.id}`,function(err,data){
		if(err) console.log(err)
		//console.log(data);
		return res.json({"json":data});
	})
})	
	
