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
    student_email_list:{
      type: [String],
      required:false
    },
    date_time_start:{
        type: Date,
        required:true
    },
    date_time_end:{
      type:Date,
      required:true,
    }
    
  });
// export the model
module.exports = User = mongoose.model("exams", ExamSchema);