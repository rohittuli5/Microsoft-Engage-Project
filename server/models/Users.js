const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create new schema for website user
const UserSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    userType:{
      type: Boolean,
      required:false
    }
    
  });
// export the model
module.exports = User = mongoose.model("users", UserSchema);