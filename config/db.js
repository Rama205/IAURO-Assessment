const mongoose = require("mongoose");

const mongoURL = process.env.DB;

mongoose.connect(mongoURL).then(()=>{
    console.log("Mongodb connectd ...")
}).catch((err)=>{
    console.log('Mongo Connection Error',err)
})