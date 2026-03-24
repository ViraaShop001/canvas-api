const { createCanvas, loadImage, registerFont } = require("canvas")
const axios = require("axios")
const fs = require("fs")
const path = require("path")

module.exports = async (req,res)=>{

try{

const nominal = req.query.nominal

if(!nominal){
return res.json({
status:false,
error:"nominal required"
})
}

const angka = Number(nominal).toLocaleString("id-ID")

const fontDir = path.resolve("./lib")

if(!fs.existsSync(fontDir)){
fs.mkdirSync(fontDir,{recursive:true})
}

const fontPath = path.join(fontDir,"GopayFont.ttf")

if(!fs.existsSync(fontPath)){

const font = await axios.get(
"https://raw.githubusercontent.com/bjirlahzee/data/main/uploads/3f4ace.ttf",
{responseType:"arraybuffer"}
)

fs.writeFileSync(fontPath,Buffer.from(font.data))

}

registerFont(fontPath,{family:"GopayFont"})

const bg = await loadImage("https://i.ibb.co/t6xRFvK/image.jpg")

const canvas = createCanvas(bg.width,bg.height)
const ctx = canvas.getContext("2d")

ctx.drawImage(bg,0,0)

ctx.fillStyle="#000"

ctx.font="65px GopayFont"
ctx.fillText("Rp "+angka,134,698)

const buffer = canvas.toBuffer("image/png")

res.setHeader("Content-Type","image/png")
res.send(buffer)

}catch(e){

res.json({
status:false,
error:e.message
})

}

}
