const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create new schema for a student exam log
const LogsSchema = new Schema({
    
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
    key_press_count: {
      type:Number,
      required:true,
      default:0,
    },
    mobile_found: {
      type:Boolean,
      required:true,
      default:false,
    },
    prohibited_object_found: {
      type:Boolean,
      required:false,
      default:false,
    },
    face_not_visible: {
      type: Boolean,
      required: true,
      default:false,
    },
    multiple_faces_found: {
      type: Boolean,
      required: true,
      default:false,
    }
    
  });
// export the model
module.exports = User = mongoose.model("logs", LogsSchema);