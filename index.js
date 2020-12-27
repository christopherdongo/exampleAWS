require('dotenv').config();

const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey:process.env.AWS_KEY_SECRET
})

const storage = multer.memoryStorage({
    destination:function(req, file, callbacks){
        callbacks(null, '');
    }
})

const upload = multer({storage}).single('image')

app.post('/uploads',upload, (req, res)=>{

    //separar el nombre y el formato
    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1]

    //parametros que se va enviar al S3
    const params={
        Bucket:process.env.AWS_BUCKET_NAME,
        Key: `${uuidv4()}.${fileType}`,
        Body: req.file.buffer
    }

    //utilizando el metodo upload 
    s3.upload(params, (err, data)=>{
        if(err){
            res.status(500).send(err)
        }
        res.status(200).send(data)
    })
} )

app.listen(PORT, ()=>{
    console.log(`server is running ${PORT}`)
})