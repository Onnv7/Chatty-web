import React, { useEffect, useRef } from 'react';

interface LocalVideoProps {
  remoteStream: MediaStream | null;
}
const LocalVideo: React.FC<LocalVideoProps> = React.memo(({ remoteStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  console.log('render local video');
  return (
    <section className="fixed bottom-[4%] right-[4%] z-[50] aspect-video w-[14rem] overflow-hidden rounded-xl bg-emerald-600">
      <video
        ref={videoRef}
        autoPlay
        className="aspect-video w-[14rem] object-fill"
      ></video>
    </section>
  );
});

export default LocalVideo;
