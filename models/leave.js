const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const leaveSchema=new Schema({
    leaveType:{
        type:String,
        required: true
    },
    startDate:{
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required:true
    },
    leaveMessage:{
        type: String,
        required:true
    },
    visitingPlace:{
        type: String,
        required: true
    },
    leaveStatus:{
        type:String,
        required:true,
        default:"Not accepted"
    }
})

module.exports=mongoose.model("Leave",leaveSchema);