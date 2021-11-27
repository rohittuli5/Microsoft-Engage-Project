import React from "react";
import swal from 'sweetalert';
//import count from './Login';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./Detections.css";

/**
 * This is the object detection class which uses webcam input 
 * feed and runs coco-ssd model for object detection
 */
export default class Detection extends React.Component {
  // Create video and canvas reference
  videoRef = React.createRef();
  canvasRef = React.createRef();

  constructor(props) {
    super(props);
    // count in state stores no of frames passed since face is not visible
    this.state = {count: 0};
  }

  /**
   * ComponentDidMount Runs when the component is first loaded
   * Setting up webcam input, loading model and calling DetectFrame which is
   * a recursive function so that it keeps detecting throughout the test
   */
  componentDidMount() {
    // setting up webcam input
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: 800,
            height: 400
          }
        })
        .then(stream => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });
      // load model and call the detectFrame function
      const modelPromise = cocoSsd.load();
      Promise.all([modelPromise, webCamPromise])
        .then(values => {
          this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  /**
   * Use the model to detect objects in the frame, pass the predictions
   * to renderPredictions function then call detectFrame again
   * @param {videoRef} video 
   * @param {ModelPromise} model 
   */
  detectFrame = (video, model) => {
    model.detect(video).then(predictions => {

      if (this.canvasRef.current) {
        
        this.renderPredictions(predictions);
        requestAnimationFrame(() => {
          this.detectFrame(video, model);
        });
      } else {
        return false;
      }
    });
  };
  
  renderPredictions = predictions => {
    
    // setting up the canvas for drawing rectangles and printing 
    // prediction text
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = "16px sans-serif";
    ctx.textBaseline = "top";

    // looping on predictions and drawing the bounding box for each object
    // and the text label background
    predictions.forEach(prediction => {

      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt("16px sans-serif", 10); // base 10
      ctx.fillRect(x, y, textWidth + 8, textHeight + 8);
      
    });

    // Looping over all predictions and drawing text (prediction class)
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      
      ctx.fillStyle = "#000000";

      // Draw the text last to ensure it's on top.
      if (prediction.class === "person" || prediction.class === "cell phone" || prediction.class === "book" || prediction.class === "laptop") {
        ctx.fillText(prediction.class, x, y);
      }
    });
    
    var faces = 0;
      // if face is not visible till 50 consecutive frames, student is
      // not in front of the computer, throw an error
      if (predictions.length === 0 && this.state.count <50){
        this.state.count++;
      }
      else if (predictions.length === 0) {
        this.state.count=0;
        swal("Face Not Visible", "Action has been Recorded", "error");
        this.props.FaceNotVisible();
      }

      // loop over all predictions and check if mobile phone, book, laptop or multiple
      // people are there in the frame 
      for (let i = 0; i < predictions.length; i++) {

        if (predictions[i].class === "cell phone") {
          this.props.MobilePhone();
          swal("Cell Phone Detected", "Action has been Recorded", "error");
          
        }

        else if (predictions[i].class === "book" || predictions[i].class === "laptop") {
          this.props.ProhibitedObject();
          swal("Prohibited Object Detected", "Action has been Recorded", "error");
          
        }
        
        else if (predictions[i].class === "person") {
          faces += 1;
          this.state.count=0;
        }

      }
      if(faces > 1){
        this.props.MultipleFacesVisible();
        swal(faces.toString()+" people detected", "Action has been recorded", "error");
      }

  };

  render() {
    return (
      <div>
        <video
          className="size"
          autoPlay
          playsInline
          muted
          ref={this.videoRef}
          width= "800"
          height= "400"
        />
        <canvas
          className="size"
          ref={this.canvasRef}
          width="800"
          height="400"
        />
      </div>
    );
  }
}