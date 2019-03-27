const Employee=require("../../models/employee");
const Leave=require("../../models/leave");

exports.addLeavesRecieved=(req,res,next)=>{
    Employee
        .find({leaveCount:{$gt:0},supervisor:req.user._id})
        .populate("leaves")
        .then(employees=>{
            console.log(employees);
            res.render("employee/leaves-recieved",{
                pageTitle:"Leaves recieved",
                path:"/leaves",
                employees:employees
            })
        })
        .catch(err=>{
            console.log(err);
        })

};

exports.postLeaveResponse=(req,res,next)=>{
    const status=req.query.status;
    const leaveId=req.body.leaveId;
    Leave.findById(leaveId)
        .then(leave=>{
            leave.leaveStatus=status;
            return leave.save()
        })
        .then(result=>{
            res.redirect("/leaves");
        })

};

exports.addSuperviseeInfo=(req,res,next)=>{
    Leave
        .find({
            $or:[
                {
                    leaveStatus:"approved",
                    supervisor:req.user._id
                },
                {
                    leaveStatus:"rejected",
                    supervisor:req.user._id
                }
            ]
        })
        .populate("employee")
        .then(leaves=>{
            console.log(leaves);
            res.render("employee/supervisee-info",{
                pageTitle:"Leaves recieved",
                path:"/supervisee",
                leaves:leaves
            })
        })
        .catch(err=>{
            console.log(err);
        })

};
