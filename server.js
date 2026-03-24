const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()

app.get("/", (req,res)=>{
res.json({
status:true,
message:"Canvas API Running 🚀"
})
})

const routesPath = path.join(__dirname,"routes")

fs.readdirSync(routesPath).forEach(file=>{

if(file.endsWith(".js")){

const route = require(`./routes/${file}`)
const name = file.replace(".js","")

app.get(`/api/${name}`, route)

console.log("Loaded endpoint → /api/"+name)

}

})

app.use((req,res)=>{
res.status(404).json({
status:false,
message:"Endpoint tidak ditemukan"
})
})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Server running on port",PORT)
})
