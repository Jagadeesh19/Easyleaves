const Employee=require("../../models/employee");

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

exports.addSuperviseeInfo=(req,res,next)=>{
    Employee.find({supervisor: req.user._id})
        .
    res.render("employee/supervisee-info",{
        pageTitle:"Supervisee",
        path:"/supervisee"
    })
};