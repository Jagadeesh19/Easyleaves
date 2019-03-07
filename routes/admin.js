const express=require("express");

const isAdmin=require("../middleware/is-admin");

const adminController=require("../controllers/admin/employee");

const router=express.Router();

router.get("/add-employee",isAdmin,adminController.getAddEmployee);

router.post("/add-employee",isAdmin,adminController.postAddEmployee);

router.get("/edit-employee/:employeeId",isAdmin,adminController.getEditEmployee);

router.post("/edit-employee",isAdmin,adminController.postEditEmployee);

router.get("/employees",isAdmin,adminController.getEmployees);

router.post("/remove",isAdmin,adminController.postRemoveEmployee);

module.exports=router;