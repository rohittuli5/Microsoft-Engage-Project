const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create new schema for an exam
const CheatingSchema = new Schema({
    exam_name: {
      type: String,
      required: true
    },
    prof_email: {
      type: String,
      required: true
    },
    student_email: {
      type: String,
      required: true
    },
    cheating_list:{
      type: [String],
      required:true
    },
    cheating_score:{
        type: Number,
        required:true
    }
    
  });
// export the model
module.exports = User = mongoose.model("cheating", CheatingSchema);