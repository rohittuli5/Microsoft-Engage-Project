const express = require("express");
const router = express.Router();

const Exam = require("../../models/Exams");
const validateExamInput = require("../../validation/CreateExam");
router.post("/createExam", (req, res) =>{

    // validate exam data for errors
    const {errors, isValid} = validateExamInput(req.body);

    // if there is some error return error code 400 with error description
    if(!isValid){
        return res.status(400).json(errors);
    }

    Exam.findOne({name : req.body.name}).then(exam=>{
        // if user is already in database return error
        // else if he is a new user create an account
        if(exam){
            return res.status(400).json({name: "Exam with same name exists in database"});
        }
        else{
            const newExam = new Exam({
                name: req.body.name,
                prof_email: req.body.prof_email,
                exam_link: req.body.exam_link,
                student_email_list: [],
                date_time_start: req.body.date_time_start,
                date_time_end: req.body.date_time_end,
            });
            for (const student_email in req.body.student_email_list){

                newExam.student_email_list.push(student_email);
            }
            newExam.save().then(exam=>res.join(exam)).catch(err=> console.log(err));
            return res.status(200).json(newExam);

        }

    });


});
async function getSchedule(req){
    let ret=[];
    const cursor = Exam.find().cursor();
    //console.log(req.body.student_email)
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        //console.log(doc.student_email_list[0]);
        if(doc.student_email_list.includes(req.body.student_email)){
            ret.push(doc);
            continue;
        }
    }
    //console.log(ret);
    return ret

}
router.get("/schedule", (req,res) => {
    let ret = getSchedule(req).then(ret=>res.status(200).json(ret));
    return res;
});
module.exports = router;