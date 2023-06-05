const sql=require("mysql")
const conn=sql.createConnection({
	"host":"localhost",
	"user":"root",
	"password":"",
	"database":"placementCell"
})
conn.connect(function(err){
	if(err) console.log(err);
	else console.log("database connection established");
})

module.exports=conn
