import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { connect } from "react-redux";
import swal from 'sweetalert';
import { logoutUser } from "../../actions/authActions";
import { Redirect, useHistory } from "react-router-dom";

function StudentDashboard(props) {

    const [exam_code, setExamCode] = useState("");
    const [error, setError] = useState("");
    const axios = require("axios");
    const moment = require("moment");
    const history = useHistory();
    function checkExamCode(){
        let payload = { exam_code: exam_code};
        const params = new URLSearchParams(payload);
        axios.get('/api/exams/examByCode?exam_code='+exam_code)
        .then(function (response) {
            console.log(response);
            let date_string = response.data.date_time_start;
            
            const exam_date_time_start = new Date(date_string);
            const exam_date_time_end = moment(exam_date_time_start).add(response.data.duration, 'm').toDate();
            const curr_date_time = new Date();
            console.log(exam_date_time_start);
            console.log(exam_date_time_end);
            console.log(curr_date_time);

            if(curr_date_time >= exam_date_time_start && curr_date_time < exam_date_time_end){
                var diff = Math.abs(exam_date_time_end - curr_date_time);
                var diff_mins = Math.floor((diff/1000)/60);
                var diff_secs = Math.floor(diff/1000)%60;
                console.log(diff, diff_mins, diff_secs);
                setError("Starting exam");
                let data={
                    exam_code: exam_code,
                    student_name: props.name,
                    student_email: props.student_email,
                    exam_link: response.data.exam_link,
                    prof_email: response.data.prof_email,
                    mins_left: diff_mins,
                    secs_left: diff_secs,
                };
                history.push({ 
                    pathname: '/test',
                    state: data
                   })
                 
            }
            else if(curr_date_time >= exam_date_time_end){
                setError("Exam has already ended");
            }
            else {

                setError("Exam has not started now");
            }
          })
          .catch(function (error) {
            console.log(error);
            setError("Exam code is invalid");
          });
    }

    return (
        <div style={{ height: "75vh"}} className="container valign-wrapper">
          <div className="row">
            <div className="col s12 center-align">
              <h4>
                <b>Hey there,</b> {props.name.split(" ")[0]}
                <p className="flow-text grey-text text-darken-1">
                  Please enter the Exam Code to start the exam
                </p>
              </h4>
                <TextField
                autoFocus
                padding="10px"
                margin="20px"
                variant="standard"
                id="exam_code"
                label="Exam Code"
                type="text"
                required={true}
                value={exam_code}
                onChange={(e)=>setExamCode(e.target.value)}
                />
              <button
                style={{
                  width: "200px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                  marginLeft:"1rem"
                }}
                onClick={checkExamCode}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Start Exam
              </button>
              <button
                style={{
                  width: "200px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                  marginLeft:"1rem"
                }}
                onClick={props.logoutUser}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Logout
              </button>
              <br/>
              <p style={{ color: "red" }}>{error}</p>
            </div>
        </div>
        </div>

    )
}
StudentDashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth
  });
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(StudentDashboard);