import React, { useEffect, useRef } from 'react';
import A from '@icon/app_icon.svg';
import '../CallingPage.css';

interface RemoteVideoProps {
  remoteStream: MediaStream | null;
}

const RemoteVideo: React.FC<RemoteVideoProps> = React.memo(
  ({ remoteStream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current && remoteStream) {
        videoRef.current.srcObject = remoteStream;
      }
    }, [remoteStream]);

    return (
      <section className="peer flex aspect-video size-full h-[100vh] items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="fixed z-[40] h-full w-full object-cover"
          style={{ filter: 'blur(10px)' }}
        />
        <video
          ref={videoRef}
          autoPlay
          className="fixed z-[50] aspect-video h-full w-[100vw] bg-transparent object-contain"
        ></video>
        <img src={A} alt="" className="z-[10] size-[10rem] rounded-full" />
      </section>
    );
  },
);

export default RemoteVideo;
