exports.addLeavesRecieved=(req,res,next)=>{
    res.render("employee/leaves-recieved",{
        pageTitle:"Leaves recieved",
        path:"/leaves"
    })
};

exports.addSuperviseeInfo=(req,res,next)=>{
    res.render("employee/leaves-recieved",{
        pageTitle:"Supervisee",
        path:"/supervisee"
    })
};