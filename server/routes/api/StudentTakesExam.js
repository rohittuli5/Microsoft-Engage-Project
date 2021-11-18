const express = require("express");
const router = express.Router();

const Cheating = require("../../models/Cheating");
//const validateCheatingInput = require("../../validation/Cheating");
router.post("/update", (req, res) =>{

    // validate cheating data for errors
    //const {errors, isValid} = validateCheatingInput(req.body);
    const isValid=true;
    // if there is some error return error code 400 with error description
    if(!isValid){
        return res.status(400).json(errors);
    }
    
    Cheating.findOneAndUpdate({exam_code: req.body.exam_code, student_email:req.body.student_email}, req.body, {upsert: true}, function(err, doc) {
        if (err){
            return res.status(400).json("Error Occoured");
        }
        return res.status(200).json("Success");
    });

});

router.get("/allData", (req,res) => {
    Cheating.find({ exam_code: req.body.exam_code}, function (err, docs) {
        if(err){
            return res.status(400).json("Error Occoured");
        }
        return res.status(200).json(docs);
    });
});
module.exports = router;