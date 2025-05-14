import { useRef, useState } from "react";
import Webcam from "react-webcam";

import react from "./assets/react.svg";

import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);

  const MAX_WIDTH = 16320;
  const MAX_HEIGHT = 12240;

  const videoConstraints = {
    // width: 640,
    // height: 480,
    width: { ideal: MAX_WIDTH },
    height: { ideal: MAX_HEIGHT },
    // facingMode: "user", // <- 테스트용 전면 카메라
    facingMode: "environment", // <- 후면 카메라 고정
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    // 이미지 다운로드
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = `capture-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      <h1>웹캠 잘 나오는 중</h1>
      <div className="webcam-container" style={{ position: "relative" }}>
        {isCameraOn && !capturedImage && (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={videoConstraints}
              style={{ width: "100%", maxWidth: "640px" }}
            />
            <img
              src={react}
              alt="react"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "100px",
                zIndex: 1000,
              }}
            />
          </>
        )}
        {capturedImage && (
          <div className="captured-image">
            <img src={capturedImage} alt="캡처된 이미지" />
          </div>
        )}
      </div>
      <div className="button-container">
        <button onClick={() => setIsCameraOn(!isCameraOn)} className="camera-toggle">
          {isCameraOn ? "카메라 끄기" : "카메라 켜기"}
        </button>
        {isCameraOn && (
          <button onClick={capture} className="capture-button">
            사진 촬영
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
