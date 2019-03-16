const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const employeeSchema=new Schema({
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required: true
    },

    name:{
        type: String,
        required: true
    },

    supervisor: {
        type: Schema.Types.ObjectId,
        ref:"Employee"
    },
    supervisee:{
        type: [Schema.Types.ObjectId],
        ref:"Employee"
    },
    leaves:[{
        type:Schema.Types.ObjectId,
        ref:"Leave"
    }],
    leaveCount:Number,
    resetToken:String,
    resetTokenExpiration: Date

});


module.exports=mongoose.model("Employee",employeeSchema);