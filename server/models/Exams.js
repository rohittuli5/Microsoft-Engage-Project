const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create new schema for an exam
const ExamSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    prof_email: {
      type: String,
      required: true
    },
    exam_link: {
      type: String,
      required: true
    },
    
    date_time_start:{
        type: Date,
        required:true
    },
    duration:{
      type: Number,
      required:true
    },
    exam_code:{
      type:String,
      required:true
    }
    
  });
// export the model
module.exports = User = mongoose.model("exams", ExamSchema);