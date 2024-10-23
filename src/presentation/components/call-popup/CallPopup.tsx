import REJECT_CALL_ICON from '@icon/phone_down_icon.svg';
import ACCEPT_CALL_ICON from '@icon/phone_up_icon.svg';
import CLOSE_ICON from '@icon/X_ICON.svg';
import INCOMING_CALL_AUDIO from '@audio/imcoming_call_audio.mp3';
import { useEffect, useState } from 'react';

import { usePeerContext } from '../../../common/context/peer.context';
import { MediaConnection } from 'peerjs';
import { openCallingWindow } from '../../../domain/usecase/conversation.usecase';
import { CallRole } from '../../../common/constant/enum';

function CallPopup() {
  const { ongoingCall, handleJoinCall, callerSocketId } = usePeerContext();
  const [showPopup, setShowPopup] = useState(ongoingCall?.isRinging);
  const [incomingCallAudio] = useState(new Audio(INCOMING_CALL_AUDIO));
  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(
    null,
  );
  const handleAccept = async () => {
    // await handleJoinCall();
    if (incomingCallAudio) {
      incomingCallAudio.pause();
      incomingCallAudio.currentTime = 0;
    }
    await openCallingWindow(
      ongoingCall?.conversation.id!,
      CallRole.CALLEE,
      callerSocketId,
    );
    setShowPopup(false);
  };

  const handleCancel = () => {
    if (incomingCall) incomingCall.close();
    if (incomingCallAudio) {
      console.log('pausse');
      incomingCallAudio.pause();
      incomingCallAudio.currentTime = 0;
    }
    setShowPopup(false);
  };
  useEffect(() => {
    if (ongoingCall?.isRinging) {
      incomingCallAudio.play();
      incomingCallAudio.loop = true;
    } else {
      incomingCallAudio.pause();
      incomingCallAudio.currentTime = 0;
    }
    setShowPopup(ongoingCall?.isRinging);
    return () => {
      incomingCallAudio.pause();
      incomingCallAudio.currentTime = 0;
    };
  }, [ongoingCall?.isRinging]);
  return (
    <>
      {ongoingCall && showPopup && (
        <div className="fixed inset-0 z-[500] flex size-full items-center justify-center bg-black bg-opacity-60">
          <section className="relative min-w-[16rem] rounded-md bg-white px-[2rem] py-[1rem]">
            <img
              src={CLOSE_ICON}
              alt=""
              className="absolute right-[0.5rem] top-[0.5rem] size-[1.8rem] cursor-pointer rounded-full p-[0.5rem] hover:bg-gray-200"
              onClick={() => setShowPopup(false)}
            />
            <div className="relative flex flex-col items-center justify-center">
              <img
                src={ongoingCall.conversation.imageUrl}
                alt=""
                className="mt-[1rem] size-[4rem] rounded-full"
              />
              <p className="mb-[3rem] mt-[1rem] text-14 font-5">
                {ongoingCall.conversation.name}
              </p>
              <div className="flex gap-8">
                <div
                  className="flex size-[3rem] items-center justify-center rounded-full bg-red-500"
                  onClick={handleCancel}
                >
                  <img src={REJECT_CALL_ICON} alt="" className="size-[2rem]" />
                </div>
                <div
                  className="flex size-[3rem] items-center justify-center rounded-full bg-green-500"
                  onClick={handleAccept}
                >
                  <img
                    src={ACCEPT_CALL_ICON}
                    alt=""
                    className="size-[1.4rem]"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default CallPopup;
