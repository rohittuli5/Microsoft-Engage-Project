import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import swal from 'sweetalert';
import { logoutUser } from "../../actions/authActions";
import LogsTable from "./LogsTable.js"
import { connect } from "react-redux";

function ProfDashboard(props) {
  const [examDialogOpen, setExamDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [exam_link, setExamLink] = useState("");
  const [date_time_start, setDateTimeStart] = useState(new Date());
  const [duration, setDuration] = useState(0);
  const [exam_code, setExamCode] = useState("");
  const [errorText, setErrorText] = useState("");
  const [exam_code_search, setExamCodeSearch] = useState("");
  const axios = require("axios");

  /**
   * This function opens the exam dialog
   * Triggered when user presses Create Exam button
   */
  function openExamDialog(){
      setExamDialogOpen(true);
  }

  /**
   * This function is called when user presses Cancel Button
   * or clicks outside the dialog box
   * It first sets all variables to their initial value then
   * closes the dialog box
   */
  function closeExamDialog(){
      setName("");
      setExamLink("");
      setDateTimeStart(new Date());
      setDuration(0);
      setExamCode("");
      setErrorText("");
      setExamDialogOpen(false);
  }

  /**
   * Uses regular expressions to check if string is url or not
   * @param {string} s 
   * @returns true if url, false otherwise
   */
  function isUrl(s) {
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      return regexp.test(s);
  }
  
  /**
   * This function is called when Create Exam button is pressed
   * It first checks whether all fields are correct, if not it displays error
   * Then it sends data to server, closes the dialog and shows a notification
   * that exam has been created
   * 
   */
  function createExam(){
      if(name===""){
          setErrorText("Name of Exam cannot be empty");
          return;
      }
      if(exam_link===""){
          setErrorText("Exam Link cannot be empty");
          return;
      }
      if(!isUrl(exam_link)){
          setErrorText("Exam Link must be a valid url");
          return;
      }
      if(duration === 0){
          setErrorText("Duration cannot be 0");
          return;
      }
      if(exam_code===""){
          setErrorText("Click Generate exam code to get an exam code first");
          return;
      }
      var current_date_time = new Date();
      if(date_time_start< current_date_time){
        setErrorText("Please select a date and time of the future");
        return;
      }
      axios.post('/api/exams/createExam', {
          name: name,
          exam_link: exam_link,
          date_time_start: date_time_start,
          duration: duration,
          exam_code: exam_code,
          prof_email: props.prof_email,
        })
        .then(function (response) {
          console.log(response);
          swal("Exam has been created. Your exam code has been copied to your clipboard, please share it with the students.");
        })
        .catch(function (error) {
          console.log(error);
          swal("Some error occoured in creating the exam");
        });
      
      closeExamDialog();
      
  }

  /**
   * Generates a random code of length 5 to be used as exam code
   */
  function generateCode(){
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      var length = 5;
      for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
          charactersLength));
      }
      setExamCode(result);
      navigator.clipboard.writeText(result);
  }
  

  return (
      <div style={{ height: "100%"}} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {props.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                You can create a new exam and see the results of previous exams. 
              </p>
            </h4>
            <button
              style={{
                width: "200px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={openExamDialog}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Create Exam
            </button>
            <button
              style={{
                width: "200px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginLeft:"10px",
                marginTop: "1rem"
              }}
              onClick={props.logoutUser}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
            <br/>
            <br/>
            <LogsTable exam_code={exam_code_search} prof_email={props.prof_email}/>
            

            
            <Dialog open={examDialogOpen} onClose={closeExamDialog} aria-labelledby="form-dialog-title" repositionOnUpdate={false}
            style={{ padding: '10px 10px 10px 10px' }}>
            <DialogTitle id="form-dialog-title">Create Exam</DialogTitle>
            <DialogContent margin="20px" style={{ padding: "30px" }}>
              <DialogContentText>
                  Enter details for the exam. Press Generate to generate the exam code and share it with the students.
              </DialogContentText>
              <TextField
                  autoFocus
                  padding="10px"
                  margin="dense"
                  variant="standard"
                  id="name"
                  label="Exam Name"
                  type="text"
                  fullWidth
                  required={true}
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
              />
              <TextField
                  id="examLink"
                  name="examLink"
                  label="Exam Link"
                  margin="dense"
                  variant="standard"
                  value={exam_link}
                  onChange={(e)=> setExamLink(e.target.value)}
                  required={true}
                  fullWidth
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="DateTimePicker"
                      value={date_time_start}
                      margin="dense"
                      variant="standard"
                      onChange={(newValue) => {
                      setDateTimeStart(newValue);
                      }}
                  />
              </LocalizationProvider>
              <TextField
                  id="duration"
                  name="duration"
                  label="Exam duration (minutes)"
                  margin="dense"
                  variant="standard"
                  value={duration}
                  onChange={(e)=> setDuration(e.target.value)}
                  required={true}
                  minDate={new Date()}
                  minTime={new Date(0, 0, 0, 8)}
              />
              <TextField
                  id="exam_code"
                  name="exam_code"
                  label="Exam Code"
                  margin="dense"
                  variant="standard"
                  value={exam_code}
                  disabled={true}
                  onChange={(e)=> setExamCode(e.target.value)}
                  required={true}
                  fullWidth
              />
              <p style={{ color: "red" }}> {errorText}</p>
              <Button onClick={generateCode}>Generate Exam Code</Button>
              </DialogContent>
              <DialogActions>
              <Button onClick={closeExamDialog} color="secondary">
                  Close
              </Button>
              <Button onClick={createExam} color="primary">
                  Save
              </Button>
              </DialogActions>
            </Dialog>
            
          </div>
        </div>
        
      </div>
      

    );
};
ProfDashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth
  });
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(ProfDashboard);