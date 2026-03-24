const axios = require("axios")
const fs = require("fs")
const path = require("path")
const { Canvas, loadImage, FontLibrary } = require("skia-canvas")

module.exports = async (req,res)=>{

try{

const nominal = req.query.nominal

if(!nominal){
return res.json({
creator:"PusatAPI",
status:false,
error:"Masukkan nominal"
})
}

const angkaInput = nominal.replace(/[^0-9]/g,"")
const angka = Number(angkaInput).toLocaleString("id-ID")

const fontDir = path.resolve("./lib")

if(!fs.existsSync(fontDir)){
fs.mkdirSync(fontDir,{recursive:true})
}

const fontPath = path.join(fontDir,"GopayFontV2.ttf")

if(!fs.existsSync(fontPath)){

const font = await axios.get(
"https://raw.githubusercontent.com/bjirlahzee/data/main/uploads/3f4ace.ttf",
{responseType:"arraybuffer"}
)

fs.writeFileSync(fontPath,Buffer.from(font.data))

}

FontLibrary.use("GopayFontV2",fontPath)

const bg = await loadImage("https://i.ibb.co/t6xRFvK/image.jpg")
const arrow = await loadImage("https://files.catbox.moe/enqxau.png")

const canvas = new Canvas(bg.width,bg.height)
const ctx = canvas.getContext("2d")

ctx.drawImage(bg,0,0)

ctx.fillStyle="#000"
ctx.textBaseline="top"

ctx.font="62px GopayFontV2"
ctx.fillText("Rp",79,698)

ctx.font="65px GopayFontV2"
ctx.fillText(angka,134,698)

const textWidth = ctx.measureText(angka).width

const arrowX = 134 + textWidth + 44
const arrowY = 694

ctx.drawImage(arrow,arrowX,arrowY)

const buffer = await canvas.png

res.setHeader("Content-Type","image/png")
res.send(buffer)

}catch(e){

res.json({
creator:"PusatAPI",
status:false,
error:e.message
})

}

}
