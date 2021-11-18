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

    Exam.findOne({code : req.body.exam_code}).then(exam=>{
        // if user is already in database return error
        // else if he is a new user create an account
        if(exam){
            return res.status(400).json({name: "Exam with this code exists in database"});
        }
        else{

            const newExam = new Exam({
                name: req.body.name,
                prof_email: req.body.prof_email,
                exam_link: req.body.exam_link,
                date_time_start: req.body.date_time_start,
                duration: req.body.duration,
                exam_code:req.body.exam_code,
            });
            
            newExam.save().then(exam=>res.join(exam)).catch(err=> console.log(err));
            return res.status(200).json(newExam);

        }

    });


});

router.get("/examsByProf", (req, res) => {
    Exam.find({ prof_email: req.body.prof_email}, function (err, docs) {
        if(err){
            return res.status(400).json("Error Occoured");
        }
        return res.status(200).json(docs);
    });
});

module.exports = router;