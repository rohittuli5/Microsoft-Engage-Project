const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create new schema for an exam
const LogsSchema = new Schema({
    exam_name: {
      type: String,
      required: true
    },
    exam_code: {
      type: String,
      required:true,
    },
    student_name:{
      type: String,
      required:true,
    },
    student_email: {
      type: String,
      required: true
    },
   
    tab_change_count: {
      type:Number,
      required:true,
      default:0,
    },
    ctrl_press_count: {
      type:Number,
      required:true,
      default:0,
    },
    alt_press_count: {
      type:Number,
      required:true,
      default:0,
    },
    full_screen_exit_count: {
      type:Number,
      required:true,
      default:0,
    },
    mobile_found_count: {
      type:Number,
      required:true,
      default:0,
    },
    prohibited_object_found_count: {
      type:Number,
      required:true,
      default:0,
    }
    
  });
// export the model
module.exports = User = mongoose.model("logs", LogsSchema);