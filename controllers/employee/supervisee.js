const {validationResult}=require("express-validator/check");

const Leave=require("../../models/leave");
const Employee=require("../../models/employee");

exports.getIndex=(req,res,next)=>{
    res.render("index",{
        pageTitle:"welcome to the easyleaves",
        path:"/"
    });
};

exports.getApplyLeave=(req,res,next)=>{
    req.session.isData=true;
    // console.log(req.session);
    res.render("employee/applyleave",{
        pageTitle:"apply leave",
        path:"/apply",
        errorMessage:null,
        validationErrors:[],
        oldInput:{}
    });
};

exports.postApplyLeave=(req,res,next)=>{
    const leaveType=req.body.leaveType;
    const visitingPlace=req.body.visitingPlace;
    const leaveMessage=req.body.leaveMessage;
    const fromDate=new Date(req.body.fromDate);
    const toDate=new Date(req.body.toDate);
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        return res.render("employee/applyleave",{
            pageTitle:"apply leave",
            path:"/apply",
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array(),
            oldInput:{
                leaveType:leaveType,
                visitingPlace:visitingPlace,
                leaveMessage:leaveMessage,
                fromDate:fromDate,
                toDate:toDate
            }
        });
    }
    const leave=new Leave({
        leaveType:leaveType,
        leaveMessage:leaveMessage,
        visitingPlace:visitingPlace,
        startDate: fromDate,
        endDate: toDate,
        employee: req.user._id,
        supervisor:req.user.supervisor
    })
    // console.log(leave);
    leave.save()
        .then((result)=>{
            req.user.leaves.push(result._id);
            req.user.leaveCount=(req.user.leaveCount)?(req.user.leaveCount+1):1;
            return req.user.save()
        })
        .then(result=>{
            // console.log(result);
            res.redirect("/status");
        })
        .catch(err=>{
            console.log(err);
            next(new Error());
        })
};

exports.getLeaveStatus=(req,res,next)=>{
    Employee.findById(req.user._id)
        .populate("leaves")
        .then(employee=>{
            // console.log(employee)
            res.render("employee/leavestatus",{
                pageTitle:"leave status",
                path:"/status",
                employee: employee
            });
        })
};

exports.postCancelLeave=(req,res,next)=>{
    const leaveId=req.body.leaveId;
    const updatedEmployee=req.user;
    Leave.findById(leaveId)
        .then(leave=>{
            leave.leaveStatus="Cancelled";
            return leave.save()
        })
        .then(result=>{
            updatedEmployee.leaves=updatedEmployee.leaves.filter(p=>p!=leaveId)
            updatedEmployee.leaveCount-=1;
            req.user=updatedEmployee;
            return req.user.save()
        })
        .then(result=>{
            // console.log(result);
            res.redirect("/status");
        })
        .catch(err=>{
            console.log(err);
        })
};

exports.getLeaveHistory=(req,res,next)=>{
    let filteredLeaves;
    Leave.updateMany({
        employee:req.user._id,
        endDate:{$lt:Date.now()},
        leaveStatus:"Not accepted"
    },
    {
        $set:{
            leaveStatus: "Timed out"
        }
    })
        .then(result=>{
            return Leave.find({
                $or:[
                    {
                        employee:req.user._id,
                        leaveStatus:"Cancelled"
                    },
                    {
                        employee:req.user._id,
                        endDate:{$lt:Date.now()}
                    }
                ]
            })
        })
        .then(leaves=>{
            filteredLeaves=leaves;
            req.user.leaves=req.user.leaves.filter(leaveId=>{
                for (let leave of leaves){
                    if (leave._id.toString()===leaveId.toString()){
                        return false;
                    }
                }
                return true;
            })
            req.user.leaveCount=req.user.leaves.length;
            return req.user.save()
        })
        .then(result=>{
            res.render("employee/leavehistory",{
                pageTitle:"leave history",
                path:"/history",
                leaves:filteredLeaves
            });
        })
        .catch(err=>{
            console.log(err);
        })
};

exports.getAccount=(req,res,next)=>{
    res.render("employee/account",{
        pageTitle:"Your Account",
        path:"/account"
    })
};
