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
    const fromDate=req.body.fromDate;
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