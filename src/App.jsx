import { useRef, useState } from "react";
import Webcam from "react-webcam";

import cameraButton from "./assets/camera_button.png";
import sendMoneyAr from "./assets/send_money_ar.png";

function AR() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const [fullPhoto, setFullPhoto] = useState(null);

  const MAX_WIDTH = 16320;
  const MAX_HEIGHT = 12240;

  const videoConstraints = {
    // width: 640,
    // height: 480,
    width: { ideal: MAX_WIDTH },
    height: { ideal: MAX_HEIGHT },
    facingMode: "user", // <- 테스트용 전면 카메라
    // facingMode: "environment", // <- 후면 카메라 고정
  };

  // 풀 해상도 촬영
  const takeFullPhoto = async () => {
    if (!webcamRef.current?.stream) return;
    const track = webcamRef.current.stream.getVideoTracks()[0];
    // ImageCapture 생성
    try {
      const imageCapture = new window.ImageCapture(track);
      const blob = await imageCapture.takePhoto();
      const reader = new FileReader();
      reader.onloadend = () => {
        setFullPhoto(reader.result);
        // 다운로드
        const link = document.createElement("a");
        link.href = reader.result;
        link.download = `fullres-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      alert("풀 해상도 촬영 실패", error);
      // fallback to screenshot
      capture();
    }
  };

  // 기본 캡처
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
    <main>
      <div className="w-full h-screen" style={{ position: "relative" }}>
        {!capturedImage && !fullPhoto && (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              screenshotQuality={1}
              screenshotWidth={MAX_WIDTH}
              screenshotHeight={MAX_HEIGHT}
              videoConstraints={videoConstraints}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <img className="relative z-10" src={sendMoneyAr} alt="sendMoneyAr" />
            <button
              className="absolute bottom-[36px] right-1/2 translate-x-1/2 cursor-pointer"
              onClick={() => {
                takeFullPhoto();
              }}
            >
              <img className="size-[72px] rotate-90" src={cameraButton} alt="cameraButton" />
            </button>
          </>
        )}
        {(capturedImage || fullPhoto) && (
          <div className="captured-image">
            <img src={fullPhoto || capturedImage} alt="캡처된 이미지" />
          </div>
        )}
      </div>
    </main>
  );
}

export default AR;
