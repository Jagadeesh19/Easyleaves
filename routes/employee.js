const express=require("express");

const supervisorController=require("../controllers/employee/supervisor");
const superviseeController=require("../controllers/employee/supervisee");
const isEmployee=require("../middleware/is-employee");

const router=express.Router();

router.get("/apply",isEmployee,superviseeController.getApplyLeave);

router.post("/apply",isEmployee,superviseeController.postApplyLeave);

router.get("/status",isEmployee,superviseeController.getLeaveStatus);

router.post("/cancel",isEmployee,superviseeController.postCancelLeave);

router.get("/history",isEmployee,superviseeController.getLeaveHistory);

router.get("/account",isEmployee,superviseeController.getAccount);

router.get("/leaves",isEmployee,supervisorController.addLeavesRecieved);

router.get("/supervisee",isEmployee,supervisorController.addSuperviseeInfo);

module.exports=router;