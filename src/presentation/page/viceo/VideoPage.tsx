import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { useSocketContext } from '../../../common/context/socket.context';
import { getMediaStream } from '../../../common/util/device.util';

function VideoPage() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [calleeId, setCalleeId] = useState<string>('');
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  // const { myPeer: peer, getMediaStream } = usePeerContext();
  const { socket } = useSocketContext();
  const conversationSocket = socket('conversation');
  async function handleCalling() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream1) => {
        setLocalStream(stream1);
        const call = peer?.call(calleeId, stream1);
        if (call) {
          // console.log('on call');
        }
        call?.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
        });
      });
  }

  useEffect(() => {
    if (conversationSocket.id) {
      const peer = new Peer(conversationSocket.id!);
      setPeer(peer);
    }
  }, [conversationSocket.id]);
  useEffect(() => {
    if (peer) {
      peer.on('call', async (call) => {
        const stram = await getMediaStream();
        setLocalStream(stram);
        call.answer(stram!);
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current)
            remoteVideoRef.current.srcObject = remoteStream;
        });
      });
      return () => {
        peer.off('call', async (call) => {
          const stram = await getMediaStream();
          setLocalStream(stram);
          call.answer(stram!);
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current)
              remoteVideoRef.current.srcObject = remoteStream;
          });
        });
      };
    }
  }, [peer]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  return (
    <div>
      <h1>My peer: {peer?.id}</h1>
      <input
        type="text"
        placeholder="id"
        value={calleeId}
        onChange={(e) => setCalleeId(e.target.value)}
      />
      <span className="flex">
        <div className="max-w-[30rem]">
          <p>remote</p>
          <video ref={remoteVideoRef} autoPlay />
        </div>
        <div className="max-w-[30rem]">
          <p>local</p>
          <video ref={localVideoRef} autoPlay muted />
        </div>
      </span>
      <button onClick={handleCalling}>Call</button>
    </div>
  );
}

export default VideoPage;
