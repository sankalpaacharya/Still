"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "./ui/button";

export default function Camera() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;
    setImage(screenshot);
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={320}
        videoConstraints={{ facingMode: "environment" }}
      />
      <Button onClick={capture}>Capture</Button>

      {image && <img src={image} />}
    </div>
  );
}
