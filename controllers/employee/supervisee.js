const Leave=require("../../models/leave");

exports.getIndex=(req,res,next)=>{
    res.render("index",{
        pageTitle:"welcome to the portal",
        path:"/"
    });
};

exports.getApplyLeave=(req,res,next)=>{
    req.session.isData=true;
    console.log(req.session);
    res.render("employee/applyleave",{
        pageTitle:"apply leave",
        path:"/apply"
    });
};

exports.postApplyLeave=(req,res,next)=>{
    const leaveType=req.body.leaveType;
    const visitingPlace=req.body.visitingPlace;
    const leaveMessage=req.body.leaveMessage;
    const fromDate=new Date(req.body.fromDate);
    const toDate=new Date(req.body.toDate);
    const leave=new Leave({
        leaveType:leaveType,
        leaveMessage:leaveMessage,
        visitingPlace:visitingPlace,
        startDate: fromDate,
        endDate: toDate,
        employee: req.user._id
    })
    console.log(leave);
    leave.save()
        .then((result)=>{
            req.user.leave=result._id;
            return req.user.save()
        })
        .then(result=>{
            console.log(result);
            res.redirect("/status");
        })
        .catch(err=>{
            console.log(err);
            next(new Error());
        })
};

exports.getLeaveStatus=(req,res,next)=>{
    res.render("employee/leavestatus",{
        pageTitle:"leave status",
        path:"/status"
    });
};

exports.getLeaveHistory=(req,res,next)=>{
    res.render("employee/leavehistory",{
        pageTitle:"leave history",
        path:"/history"
    });
};

exports.getAccount=(req,res,next)=>{
    res.render("employee/account",{
        pageTitle:"Your Account",
        path:"/account"
    })
};