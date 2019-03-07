const crypto=require("crypto");

const bcrypt=require("bcryptjs");
const nodemailer=require("nodemailer");
const sendgridTransport=require("nodemailer-sendgrid-transport");

const Employee=require("../models/employee");
const Admin=require("../models/admin");

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: "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"
    }
}));

exports.getLogin=(req,res,next)=> {
    let message=req.flash("error");
    if (message.length>0)
        message=message[0];
    else
        message=null;
    res.render("auth/login", {
        pageTitle: "Login page",
        path: "/login",
        errorMessage:message
    });
}

exports.postLogin=(req,res,next)=> {
    const username=req.body.username.toLowerCase();
    const password=req.body.password;
    let user;
    if (username==="admin"){
        Admin.findOne()
            .then(admin=>{
                user=admin;
                return bcrypt.compare(password,admin.password);
            })
            .then(doMatch=>{
                if (doMatch){
                    req.session.isLoggedIn=true;
                    req.session.user=user;
                    req.session.userType="admin";
                    return req.session.save(err=>{
                        console.log(err);
                        res.redirect("/");
                    });
                }
                req.flash("error","Invalid username or password");
                res.redirect("/login");
            })
    }
    else{
        Employee.findOne({email:username})
            .then(employee=>{
                if (!employee){
                    req.flash("error","Invalid username or password");
                    return res.redirect("/login");
                }
                bcrypt.compare(password,employee.password)
                    .then(doMatch=>{
                        if (doMatch){
                            req.session.isLoggedIn=true;
                            req.session.user=employee;
                            req.session.userType="employee";
                            return req.session.save(err=>{
                                console.log(err);
                                res.redirect("/");
                            });
                        }
                        req.flash("error","Invalid username or password");
                        res.redirect("/login");
                    })
                    .catch(err=>{
                        console.log(err);
                        res.redirect("/login");
                    });
            })
            .catch(err=>{
                console.log(err);
            });
    }
}

exports.postLogout=(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    })
}

exports.getReset=(req,res,next)=>{
    let message=req.flash("error");
    if (message.length>0)
        message=message[0];
    else
        message=null;
    res.render("auth/reset", {
        pageTitle: "Reset Password",
        path: "/reset",
        errorMessage:message
    });
}

exports.postReset=(req,res,next)=>{
    const username=req.body.username.toLowerCase();
    let adminEmail;
    crypto.randomBytes(32,(err,buffer)=>{
        if (err){
            console.log(err);
            res.redirect("/reset");
        }
        const token=buffer.toString("hex");
        if (username==="admin"){
            req.session.resetType="admin";
            Admin.findOne()
                .then(admin=>{
                    adminEmail=admin.email;
                    admin.resetToken=token;
                    admin.resetTokenExpiration=Date.now()+3600000;
                    return admin.save()
                })
                .then(result=>{
                    res.redirect("/");
                    transporter.sendMail({
                        to: adminEmail,
                        from: "reset@leaveportal.com",
                        subject: "Password Reset",
                        html: `
                                    <h3>You requested for a password reset</h3>
                                    <h3>Follow the below link to reset your password</h3>
                                    <p><a href="http://localhost:3000/reset/${token}">click here</a> </p>`
                    });
                })
        }
        else{
            Employee.findOne({email:username})
                .then(employee=>{
                    if (!employee){
                        req.flash("error","No account found");
                        return res.redirect("/reset");
                    }
                    employee.resetToken=token;
                    employee.resetTokenExpiration=Date.now()+3600000;
                    employee.save()
                        .then(result=>{
                            res.redirect("/");
                            transporter.sendMail({
                                to: username,
                                from: "reset@leaveportal.com",
                                subject: "Password Reset",
                                html: `
                                    <h3>You requested for a password reset</h3>
                                    <h3>Follow the below link to reset your password</h3>
                                    <p><a href="http://localhost:3000/reset/${token}">click here</a> </p>`
                            });
                        })
                })
                .catch(err=>{
                    console.log(err);
                })
        }
    })
}

exports.getNewPassword=(req,res,next)=>{
    const token=req.params.token;
    const userType=req.session.resetType;
    console.log(userType);
    if (userType=="admin"){
        Admin.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
            .then(admin=>{
                let message=req.flash("error");
                if (message.length>0)
                    message=message[0];
                else
                    message=null;
                res.render("auth/new-password", {
                    pageTitle: "Set new password",
                    path: "/new-password",
                    errorMessage:message,
                    userId:admin._id.toString(),
                    userType:"admin",
                    passwordToken:token
                });
            })
            .catch(err=>{
                console.log(err);
            })
    }
    else{
        Employee.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
            .then(employee=>{
                let message=req.flash("error");
                if (message.length>0)
                    message=message[0];
                else
                    message=null;
                res.render("auth/new-password", {
                    pageTitle: "Set new password",
                    path: "/new-password",
                    errorMessage:message,
                    userId:employee._id.toString(),
                    userType:"employee",
                    passwordToken:token
                });
            })
    }
}

exports.postNewPassword=(req,res,next)=>{
    const newPassword=req.body.password;
    const userId=req.body.userId;
    const userType=req.body.userType;
    const passwordToken=req.body.passwordToken;
    let resetUser;

    if (userType==="admin"){
        Admin.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()}})
            .then(admin=>{
                resetUser=admin;
                return bcrypt.hash(newPassword,12)
            })
            .then(hashedPassword=>{
                resetUser.password=hashedPassword;
                resetUser.resetTokenExpiration=undefined;
                resetUser.resetToken=undefined;
                return resetUser.save()
            })
            .then(result=>{
                res.redirect("/login");
            })
            .catch(err=>{
                console.log(err);
            })
    }
    else{
        Employee.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()}})
            .then(employee=>{
                resetUser=employee;
                return bcrypt.hash(newPassword,12)
            })
            .then(hashedPassword=>{
                resetUser.password=hashedPassword;
                resetUser.resetTokenExpiration=undefined;
                resetUser.resetToken=undefined;
                return resetUser.save()
            })
            .then(result=>{
                res.redirect("/login");
            })
            .catch(err=>{
                console.log(err);
            })
    }
}