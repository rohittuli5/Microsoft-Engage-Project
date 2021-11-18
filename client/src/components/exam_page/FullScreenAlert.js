import React from 'react'
import { Button } from '@mui/material';
import warning from "./warning.jpg"
import { useState, useEffect } from 'react';
import {Redirect} from 'react-router-dom'

const FullScreenAlert = (props) => {

  //Disable Right click
  if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
        // prevent default behaviour (right click menu show)
        e.preventDefault();
    }, false);
  }

  var elem = document.documentElement;
  function redirectToExamPage() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      //this.props.history.push("/test")
      <Redirect to='/test'/>
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
      //this.props.history.push("/test")
      <Redirect to='/test'/>
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
      <Redirect to='/test'/>
      //this.props.history.push("/test")
    }

  }

  //timer 
  var mins_left = sessionStorage.getItem("exam_timer");
  var secs_left = sessionStorage.getItem("exam_sec");

  if(secs_left === null){
    secs_left = 0;
  }
 const { initialMinute = mins_left, initialSeconds = secs_left } = props;
  const myInterval = React.useRef();
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        // TODO api call here
      }
      else {
         // TODO api call here
          setMinutes(minutes - 1);
          setSeconds(59);
         
        }

  },1000);
 
      return () => {
      clearInterval(myInterval);
    };
  });

  return (<div className="App-header">
    <center>
    <div>
      <img src={warning} id="warningIcon" />
      </div>
      <br/>
      <h3>
        You have escaped full screen, your progress might be lost.
        </h3>
        <br/>
        <small>
            This action has been recorded and penality applied.
        </small>
        <br/>
        <br/>
       
      <Button variant='contained' onClick={redirectToExamPage}>Go Back to exam</Button>
    </center>
  </div>
  )
}

export default FullScreenAlert;