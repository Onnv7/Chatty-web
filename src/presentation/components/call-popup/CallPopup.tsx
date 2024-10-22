import React, { useEffect, useState } from 'react';
import { usePeerContext } from '../../../common/context/peer.context';
import { MediaConnection } from 'peerjs';
import { openCallingWindow } from '../../../domain/usecase/conversation.usecase';
import { CallRole } from '../../../common/constant/enum';

function CallPopup() {
  const { ongoingCall, handleJoinCall, callerSocketId } = usePeerContext();
  const [showPopup, setShowPopup] = useState(ongoingCall?.isRinging);
  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(
    null,
  );
  const handleAccept = async () => {
    // await handleJoinCall();

    await openCallingWindow(
      ongoingCall?.conversation.id!,
      CallRole.CALLEE,
      callerSocketId,
    );
  };

  const handleCancel = () => {
    if (incomingCall) incomingCall.close();
    setShowPopup(false);
  };
  useEffect(() => {
    setShowPopup(ongoingCall?.isRinging);
  }, [ongoingCall?.isRinging]);
  return (
    <>
      {ongoingCall && showPopup && (
        <div className="fixed inset-0 z-[500] flex size-full items-center justify-center bg-black bg-opacity-60">
          <section className="flex w-[30rem] flex-col items-center rounded-md bg-white">
            <h1>My Peer ID: </h1>
            <div className="popup">
              <img
                src={ongoingCall.conversation.imageUrl}
                alt=""
                className="size-[4rem] rounded-full"
              />
              <p>Incoming call from: {ongoingCall.conversation.name}</p>
              <div className="flex">
                <button className="bg-red-500" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="bg-green-500" onClick={handleAccept}>
                  Accept
                </button>
              </div>
            </div>
            {/* Video của người gọi */}
            {/* <video ref={remoteVideoRef} autoPlay /> */}
          </section>
        </div>
      )}
    </>
  );
}

export default CallPopup;
