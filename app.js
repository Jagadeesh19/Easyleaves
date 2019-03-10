const path=require("path");

const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash=require("connect-flash");
const bcrypt=require("bcryptjs");

const indexController=require("./controllers/startpage");
const employeeRoutes=require("./routes/employee");
const adminRoutes=require("./routes/admin");
const authRoutes=require("./routes/auth");
const errorController=require("./controllers/error");
const Admin=require("./models/admin");
const Employee=require("./models/employee");

const MONGO_URI=
    "mongodb+srv://jagadeesh:Yuva12345@cluster0-ge9fd.mongodb.net/leaveportal";

const app=express();
const store=new MongoDBStore({
    uri:MONGO_URI,
    collection:"sessions"
})

app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"Public")));

app.use(bodyParser.urlencoded({extended:false}));

app.use(
    session({
        secret:"my secret",
        resave:false,
        saveUninitialized:false,
        store:store
    })
);

app.use(flash());


app.use((req,res,next)=>{
    res.locals.isLoggedIn=req.session.isLoggedIn;
    res.locals.userType=req.session.userType;
    next();
})

app.use((req,res,next)=>{
    if (!req.session.user){
        return next();
    }
    if (req.session.userType!=="admin"){
        Employee.findById(req.session.user._id)
            .then(employee=>{
                req.user=employee;
                next();
            })
            .catch(err=>{
                console.log(err);
            })
    }
})


app.get("/",indexController);

app.use(employeeRoutes);

app.use("/admin",adminRoutes);

app.use(authRoutes);

app.use("/500",errorController.get500);

app.use(errorController.get404);

app.use((error,req,res,next)=>{
    res.redirect("/500");
})

mongoose
    .connect(MONGO_URI)
    .then(result=>{
        app.listen(3000);
        return Admin.findOne()
    })
    .then(admin=>{
        if (!admin){
            const password="12345";
            bcrypt.hash(password,12)
                .then(hashedPassword=>{
                    const admin=new Admin({password:hashedPassword});
                    admin.save();
                })
                .catch(err=>{
                    console.log(err);
                });
        }
    })
    .catch(err=>{
        console.log(err);
    });

