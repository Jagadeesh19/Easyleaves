const express=require("express");
const {check,body}=require("express-validator/check");

const supervisorController=require("../controllers/employee/supervisor");
const superviseeController=require("../controllers/employee/supervisee");
const isEmployee=require("../middleware/is-employee");

const router=express.Router();

router.get("/apply",isEmployee,superviseeController.getApplyLeave);

router.post("/apply",
    [
      body("fromDate")
          .custom((val,{req})=>{
              if (new Date(val)<Date.now()){
                  throw new Error("Enter a valid date");
              }
              return true;
          }),
      body("toDate")
          .custom((val,{req})=>{
              if (new Date(val)<new Date(req.body.fromDate)){
                  throw new Error("Enter a valid combination of dates");
              }
              return true;
          })
    ],
    isEmployee,
    superviseeController.postApplyLeave
);

router.get("/status",isEmployee,superviseeController.getLeaveStatus);

router.post("/cancel",isEmployee,superviseeController.postCancelLeave);

router.get("/history",isEmployee,superviseeController.getLeaveHistory);

router.get("/account",isEmployee,superviseeController.getAccount);

router.get("/leaves",isEmployee,supervisorController.addLeavesRecieved);

router.post("/response",isEmployee,supervisorController.postLeaveResponse);

router.get("/supervisee",isEmployee,supervisorController.addSuperviseeInfo);

module.exports=router;