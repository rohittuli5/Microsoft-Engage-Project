import React from "react";
import swal from 'sweetalert';
//import count from './Login';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./Detections.css";


export default class Detection extends React.Component {
  videoRef = React.createRef();
  canvasRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }
  componentDidMount() {
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
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Setting font and text location for prediction.
    ctx.font = "16px sans-serif";
    ctx.textBaseline = "top";
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
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";

      if (prediction.class === "person" || prediction.class === "cell phone" || prediction.class === "book" || prediction.class === "laptop") {
        ctx.fillText(prediction.class, x, y);
      }
    });
    
    var faces = 0;
    
      if (predictions.length === 0 && this.state.count <50){
        this.state.count++;
      }
      else if (predictions.length === 0) {
        this.state.count=0;
        swal("Face Not Visible", "Action has been Recorded", "error");
        this.props.FaceNotVisible();
      }

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