import React from 'react';
import { useState, useEffect } from 'react';
import Detection from './Object_Detection';
import { Button } from '@mui/material';
import DetectRTC from 'detectrtc';
import swal from 'sweetalert';
// import exam_timer from './formvalid';
// import formvalid from './formvalid';
import "./Dashboard2.css";
import { Redirect } from "react-router-dom";
import Posenet from './Pose_Detection';


const TestPage = (props) => {

  var form_link = "www.google.com";
  var name= "Default User";
  var exam_id = "Default id";
//   const [tabChange, setTabChange]= useState(0);
//   const [fullScreenExit, setFullScreenExit]= useState(0);
//   const [altPress, setAltPress]= useState(0);
//   const [ctrlPress, setCtrlPress]= useState(0);
    var tabChange=0, fullScreenExit=0,altPress=0,ctrlPress=0;

  //TODO get name and exam id here
  

  //Disable Right click
  if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, false);
  }

  // Alert on Tab Changed within the Same browser Window
  function handleVisibilityChange() {
    if (document.hidden) {
        
        swal("Changed Tab Detected", "Action has been Recorded", "error");
        // the page is hidden
        //setTabChange(tabChange+1);
        tabChange+=1;
        //sessionStorage.setItem("count_tabchange", count_tabchange);
    } else {
      // the page is visible
    }
  }
  document.addEventListener("visibilitychange", handleVisibilityChange, false);

  //To make sure the user does not open any other App or lose Focus from the test Window
  var i = 0;
    

    function onAccept() {
      //this.props.history.push('/thankyou')
      <Redirect to='/thankyou'/>
    }


  // Count number of times escaped Fullscreen

  if (document.fullscreenElement) {
    //console.log("In Full");
  } else {
    //setFullScreenExit(fullScreenExit+1);
    fullScreenExit+=1;
    // TODO Api call here
    //this.props.history.push('fullscreenalert');
    <Redirect to='/fullscreenalert'/>
  }

  document.addEventListener('fullscreenchange', (event) => {
    var count_fullscreen = 0;
    if (document.fullscreenElement) {
        // user is in full screen mode here
     // console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
    } 
    else {
        //setFullScreenExit(fullScreenExit+1);
        fullScreenExit+=1;
        // TODO Api call here
        //this.props.history.push("/fullscreenalert")
        <Redirect to='/fullscreenalert'/>

    }
  });

  document.onkeydown = function (event) {
    console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);

    if (event.altKey) {
      swal('Alt Key Press Detected');
      //setAltPress(altPress+1);
      altPress+=1;
      // TODO API Call here
      return false;
    }
    else if(event.ctrlKey) {
        swal('Ctrl Key Press Detected');
        //setCtrlPress(ctrlPress+1);
        ctrlPress+=1;
        // TODO API Call here
        return false;
    }
    else {
      return true;
    }
  }
  
  

  //Displays Score in Thankyou page
  function handleSubmitExam() {
    // var PIDs = sessionStorage.getItem("checkname").slice(-6)
    // //console.log(PIDs)
    // var count_facedetect = sessionStorage.getItem("count_facedetect")
    // var count_fullscreen = sessionStorage.getItem("count_fullscreen")
    // var count_tabchange = sessionStorage.getItem("count_tabchange")
    // var countalt = sessionStorage.getItem("countalt")
    // var countctrl = sessionStorage.getItem("countctrl")
    // var checkn = sessionStorage.getItem("checkname")
    // var checke = sessionStorage.getItem("checkemail")
    // var photo = sessionStorage.getItem("imageSrc")
    // //Fetching data from FireBase
    // const con_db = firebase.database().ref("stud_records");
    // con_db.on('value', (snapshot) => {


    //   var s = snapshot.val()
    //   var codeexam = sessionStorage.getItem("formvalid", formvalid);
    //   //var codeexam =  s[d]
    //   //console.log(s)
    //   con_db.child(codeexam).child(PIDs).set({
    //     alt: countalt,
    //     tab: count_tabchange,
    //     face: count_facedetect,
    //     fullscreen: count_fullscreen,
    //     semail: checke,
    //     sname: checkn,
    //     photo: photo

    //   })
    // });

    // TODO Call APIs here
    //this.props.history.push('/thankyou')
    <Redirect to='/thankyou'/>
  };

  
// Camera Permission
  DetectRTC.load(function () {

    const webcam = DetectRTC.isWebsiteHasWebcamPermissions;
    if (!webcam) {
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      var video = document.querySelector("#videoElement");
      if (navigator.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function (stream) {
            video.srcObject = stream;
          })

          .catch(function (err) {
            console.log(err);
          });
      }
    }

  });


// // enable/disable iframe according to camera permissions
//   const webcam = DetectRTC.isWebsiteHasWebcamPermissions;
 

//     if (webcam === true) {
//         // TODO update form link here
//         //var isAllowed = sessionStorage.getItem("form_link");;  
//   } 
//     else {
//     form_link = '/components/404.js';
//     swal("Enable Your Camera");
//   }
  
  // Fetches the timer provided by Admin in Admin page to Dashboard
  // TODO API Call for exam time
//   var get_time = sessionStorage.getItem("exam_timer");
//   var get_sec = sessionStorage.getItem("exam_sec");
var get_time=0, get_sec=0;
  if(get_sec === null){
    get_sec = 0;
  }
 //const { initialMinute = get_time, initialSeconds = get_sec } = props;
  const myInterval = React.useRef();
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        var currectSec = seconds;
         sessionStorage.setItem("exam_sec", currectSec);
      }
      else {
         var currectTime = minutes-1;
          sessionStorage.setItem("exam_timer", currectTime);
          setMinutes(minutes - 1);
          setSeconds(59);
         
        }

        if (minutes === 1 && seconds === 0) {
          swal("Only 1 Minute Left, Please Submit or attendance wont be marked");
        }

      if (seconds <= 0 && minutes <= 0) {
         //this.props.history.push('/thankyou');
         <Redirect to='/thankyou'/>
        }

  },1000);
 
      return () => {
      clearInterval(myInterval);
    };

  });
 
  return (


    <div className="App-header" id="Dash">
      <header>

        <div className="detect">
          <Detection/>
          
        </div>

        <div className="lame">
          <h3 align="left">Name:  <span style={{ fontSize: '20px' }} > {name}</span></h3>
          <h3 align="left">Exam ID:  <span style={{ fontSize: '20px' }} > {exam_id}</span></h3>
        </div>

        <div className="leftClass">
          <p>Timer: {minutes === 0 && seconds === 1 ? null : <h1 align="center" style={{ fontSize: '69px' }}>  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
          } </p>
        </div>

        <div className="button">
          <p align="center" style={{ fontSize: '18px' }}>To Save Your Attendance :<br/> Kindly Click <strong>Exit Exam</strong> after submitting the exam </p>
          <center>
            <Button
              style={{ fontSize: '15px' }}
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleSubmitExam}>
              Exit Exam
              </Button>
          </center>
          
        </div>

        <iframe src={'www.google.com'} id='form'>Loading…</iframe >

      </header>

    </div>
  )
}

export default TestPage;
