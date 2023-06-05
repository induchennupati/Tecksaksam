const express=require("express");
const app=express();
const authenticate=require("./Authentication.js");
const profile=require("./profile.js");
const cors=require("cors");
const company=require("./company.js")
const mail=require("./mail.js")
const companyUpdate=require("./companyUpdate.js");

const corsOptions = {
  origin: '*',
}
app.use(cors(corsOptions))
app.use(express.static("./static"));
app.use(express.static("./static/frontend"));
app.use(express.static("./company"));
app.use("/Authentication",authenticate);
app.use("/Profile",profile)
app.use("/Company",company)
app.use("/mail",mail)
app.use("/companyUpdate",companyUpdate)

app.get("/",function(req,res){
	res.sendFile(__dirname+"/static/frontend/home.html");
})

app.listen(8080,function(){
	console.log("Activated");
	})
