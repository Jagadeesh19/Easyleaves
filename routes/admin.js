const express=require("express");
const {check,body}=require("express-validator/check");

const Employee=require("../models/employee");

const isAdmin=require("../middleware/is-admin");

const adminController=require("../controllers/admin/employee");

const router=express.Router();

router.get("/add-employee",isAdmin,adminController.getAddEmployee);

router.post(
    "/add-employee",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email")
            .custom((value,obj) => {
                return Employee.findOne({email:value})
                    .then(employee=> {
                        if (employee) {
                            return Promise.reject("The employee with this email already exists");
                        }
                    });
                return true;
            }),
        body("supervisor")
            .custom((value)=>{
                if (value==0){
                    return true;
                }
                return Employee.findOne({email: value})
                    .then(employee=> {
                        if (!employee) {
                            return Promise.reject("The Supervisor does not exist");
                        }
                    })
            })
    ],
    isAdmin,
    adminController.postAddEmployee);

router.get("/edit-employee/:employeeId",isAdmin,adminController.getEditEmployee);

router.post("/edit-employee",isAdmin,adminController.postEditEmployee);

router.get("/employees",isAdmin,adminController.getEmployees);

// router.delete("/remove/:employeeId",isAdmin,adminController.RemoveEmployee);
router.post("/remove",isAdmin,adminController.postRemoveEmployee);

module.exports=router;
