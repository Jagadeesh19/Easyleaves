const crypto=require("crypto");

const bcrypt=require("bcryptjs");
const nodemailer=require("nodemailer");
const sendgridTransport=require("nodemailer-sendgrid-transport");
const {validationResult}=require("express-validator/check");

const Employee=require("../../models/employee");

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: process.env.MAIL_API
    }
}));

exports.getAddEmployee=(req,res,next)=>{
    let message=req.flash("error");
    if (message.length>0)
        message=message[0];
    else
        message=null;
    res.render("admin/edit-employee",{
        path:"/add-employee",
        pageTitle:"Add Employees",
        errorMessage:message,
        editing:false,
        validationErrors:[],
        oldInput:{email:"",name:"",supervisorEmail:""}
    });
}

exports.postAddEmployee=(req,res,next)=>{
    const email=req.body.email.toLowerCase();
    const name=req.body.name;
    const supervisorEmail=req.body.supervisor.toLowerCase();
    let password;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render("admin/edit-employee",{
            path:"/add-employee",
            pageTitle:"Add Employees",
            errorMessage:errors.array()[0].msg,
            editing:false,
            validationErrors:errors.array(),
            oldInput:{email:email,name:name,supervisorEmail:supervisorEmail}
        });
    }
    const employeeObject={
        email:email,
        name:name
    }
    let supervisor;
    crypto.randomBytes(7,(err,buffer)=>{
        if (err){
            return console.log(err);
        }
        password=buffer.toString("hex");
        bcrypt.hash(password,12)
            .then(hashedPassword=>{
                employeeObject.password=hashedPassword;
                if (supervisorEmail) {
                    Employee.findOne({email: supervisorEmail})
                        .then(employee=>{
                            supervisor=employee;
                            employeeObject.supervisor=employee._id;
                            const newEmployee=new Employee(employeeObject);
                            newEmployee.save()
                                .then(result=>{
                                    console.log(result);
                                    supervisor.supervisee.push(result._id);
                                    return supervisor.save();

                                })
                                .then(result=>{
                                    console.log(result);
                                    res.redirect("/admin/employees");
                                    return transporter.sendMail({
                                        to: email,
                                        from: "admin@leaveportal.com",
                                        subject: "Your account created",
                                        html:`
                                        <h3>Your account has been created at Leaveportal</h3>
                                        <h3>username: ${email}<br/>password: ${password}</h3>
                                        <h3>Kindly change your password.</h3>`
                                    });
                                })
                        })

                        .catch(err=>{
                            console.log(err);
                            return next(new Error());
                        });
                }
                else{
                    const newEmployee=new Employee(employeeObject);
                    newEmployee.save()
                        .then(result=>{
                            console.log(result._id);
                            res.redirect("/admin/employees");
                            return transporter.sendMail({
                                to: email,
                                from: "admin@leaveportal.com",
                                subject: "Your account created",
                                html:`
                        <h3>Your account has been created at Leaveportal</h3>
                        <h3>username: ${email}<br/>password: ${password}</h3>
                        <h3>Kindly change your password.</h3>
                    `
                            });
                        })
                        .catch(err=>{
                            console.log(err);
                            return next(new Error());
                        });
                }
            })
            .catch(err=>{
                console.log(err);
                return next(new Error());
            });
    });

}


exports.getEmployees=(req,res,next)=>{
    Employee.find()
        .populate("supervisor")
        .then(employees=>{
            // console.log(employees);
            let message=req.flash("error");
            if (message.length>0)
                message=message[0];
            else
                message=null;
            res.render("admin/employees",{
                employees:employees,
                path:"/employees",
                pageTitle:"Manage Employees",
                errorMessage:message
            });
        })
        .catch(err=>{
            console.log(err);
            return next(new Error());
        })

}

exports.getEditEmployee=(req,res,next)=>{
    const employeeId=req.params.employeeId;
    Employee.findById(employeeId)
        .populate("supervisor")
        .then(employee=>{
            console.log(employee);
            let message=req.flash("error");
            if (message.length>0)
                message=message[0];
            else
                message=null;
            res.render("admin/edit-employee",{
                path:"/edit-employee",
                pageTitle:"Edit Employees",
                errorMessage:message,
                editing:true,
                employee:employee,
                validationErrors:[],
                oldInput:{email:"",name:"",supervisorEmail:""}
            });
        })
        .catch(err=>{
            console.log(err);
            return next(new Error());
        })
}

exports.postEditEmployee=(req,res,next)=>{
    res.redirect("/admin/employees");
}

exports.RemoveEmployee=(req,res,next)=>{
    const employeeId=req.params.employeeId;
    let supervisorId;
    Employee.findById(employeeId)
        .then(employee=>{
            supervisorId=employee.supervisor;
            if (employee.supervisee.length>0){
                req.flash("error","Cannot remove employee, there are supervisees under him");
                return res.redirect("/admin/employees");
            }
            employee.remove()
                .then(result=>{
                    if (!supervisorId){
                        return res.status(200).json({
                            message:"success!"
                        });
                    }
                    Employee.findById(supervisorId)
                        .then(supervisor=>{
                            supervisor.supervisee=supervisor.supervisee.filter(id=>id!=employeeId);
                            return supervisor.save();
                        })
                        .then(result=>{
                            res.status(200).json({
                                message:"success!"
                            });
                        })
                })
        })
        .catch((err=>{
            res.status(500).json({
                message:"deleting employee failed!"
            });
        }))
}

