const express=require("express");
const {check,body}=require("express-validator/check");

const authControllers=require("../controllers/auth");

const router=express.Router();

router.get("/login",authControllers.getLogin);

router.post("/login",authControllers.postLogin);

router.post("/logout",authControllers.postLogout);

router.get("/reset",authControllers.getReset);

router.get("/reset/:token",authControllers.getNewPassword);

router.post("/reset",authControllers.postReset);

router.post("/new-password",
    [
        body(
            "password",
            "The password should have atleast 5 characters"
        )
            .isLength({min:5}),
        body(
            "confirmPassword"
        )
            .custom((value,{req})=>{
                if (req.body.password!==value){
                    throw new Error("Passwords have to match");
                }
                return true;
            })
    ]
    ,authControllers.postNewPassword);

module.exports=router;