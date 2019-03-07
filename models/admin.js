const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const adminSchema=new Schema({
   username:{
       type: String,
       required:true,
       default: "admin"
   },

   password:{
       type: String,
       required: true,
   },
   email:{
       type:String,
       default: "yeturujagadeesh@gmail.com",
       required:true
   },
   resetToken:String,
   resetTokenExpiration: Date
});

module.exports=mongoose.model("admin",adminSchema);