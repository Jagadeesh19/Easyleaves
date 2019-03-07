const express=require("express");

const authControllers=require("../controllers/auth");

const router=express.Router();

router.get("/login",authControllers.getLogin);

router.post("/login",authControllers.postLogin);

router.post("/logout",authControllers.postLogout);

router.get("/reset",authControllers.getReset);

router.get("/reset/:token",authControllers.getNewPassword);

router.post("/reset",authControllers.postReset);

router.post("/new-password",authControllers.postNewPassword);

module.exports=router;