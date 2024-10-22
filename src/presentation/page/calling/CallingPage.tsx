import './CallingPage.css';
import AVATAR from '@image/register_background_image.png';
import A from '@icon/app_icon.svg';
import MIC_ON_ICON from '@icon/mic_on_icon.svg';
import MIC_OFF_ICON from '@icon/mic_off_icon.svg';
import CAMERA_ON_ICON from '@icon/camera_on_icon.svg';
import CAMERA_OFF_ICON from '@icon/camera_off_icon.svg';
import PHONE_DOWN_ICON from '@icon/phone_down_icon.svg';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCallApi } from '../../../common/hook/useCallApi';
import {
  getConversation,
  getConversationId,
} from '../../../domain/usecase/conversation.usecase';
import { useAuthContext } from '../../../common/context/auth.context';
import { ConversationInfoEntity } from '../../../domain/entity/conversation.entity';
import { usePeerContext } from '../../../common/context/peer.context';
import { CallRole } from '../../../common/constant/enum';
import { useSocketContext } from '../../../common/context/socket.context';

function CallingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { localStream, remoteStream, handleCall, ongoingCall, handleJoinCall } =
    usePeerContext();
  const { socket } = useSocketContext();
  const conversationSocket = socket('conversation');
  const conversationId = searchParams.get('id');

  const { userId, profile } = useAuthContext();

  const friendId = searchParams.get('friend');
  const conversationApi = useCallApi();

  const [isVideoOn, setIsVideoOn] = useState(true);

  const videoRemoteRef = useRef<HTMLVideoElement>(null);
  const videoLocalRef = useRef<HTMLVideoElement>(null);
  const videoBlurRef = useRef<HTMLVideoElement>(null);

  const callerSocketId = window.opener?.sharedData?.callerSocketId ?? null;

  const [callRole, setCallRole] = useState<CallRole | null>(
    window.opener?.sharedData?.callRole ?? null,
  );

  const [conversationEntity, setConversationEntity] =
    useState<ConversationInfoEntity>();
  const toggleVideo = async () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        if (track.enabled) {
          track.stop();
        }
      });
      setIsVideoOn(!isVideoOn);
    } else {
    }
  };

  useEffect(() => {
    if (friendId) {
      conversationApi.callApi(async () => {
        const converId = await getConversationId(Number(friendId), userId!);

        if (converId) {
          setSearchParams({ id: converId });
        } else {
        }
      });
    } else if (profile) {
      conversationApi.callApi(async () => {
        const data = await getConversation(conversationId!, userId!);
        setConversationEntity(data);
      });
    }
  }, [conversationId, friendId, profile]);

  useEffect(() => {
    const initIfFromAnotherPage = async () => {
      if (!conversationSocket.id) {
        return;
      }
      if (callRole === CallRole.CALLER && profile && conversationEntity) {
        await handleCall(conversationId!);
      } else if (callRole === CallRole.CALLEE) {
        await handleJoinCall(callerSocketId!);
      }
    };
    initIfFromAnotherPage();
  }, [conversationSocket.id, conversationEntity, profile]);

  useEffect(() => {
    if (videoRemoteRef.current && remoteStream) {
      videoRemoteRef.current.srcObject = remoteStream;
    }
    if (videoBlurRef.current && remoteStream) {
      videoBlurRef.current.srcObject = remoteStream;
    }
    if (videoLocalRef.current && localStream) {
      videoLocalRef.current.srcObject = localStream;
    }
  }, [remoteStream, localStream]);

  return (
    <>
      {callRole !== null ? (
        <div className="parent relative">
          <section className="peer flex aspect-video size-full h-[100vh] items-center justify-center">
            <video
              ref={videoBlurRef}
              autoPlay
              playsInline
              muted
              className="fixed z-[40] h-full w-full object-cover blur-lg"
            />
            <video
              ref={videoRemoteRef}
              autoPlay
              className="fixed z-[50] aspect-video h-full w-[100vw] bg-transparent object-contain"
            ></video>
            <img src={A} alt="" className="z-[10] size-[10rem] rounded-full" />
          </section>
          <section className="fixed bottom-[4%] right-[4%] z-[50] aspect-video w-[14rem] overflow-hidden rounded-xl bg-emerald-600">
            <video
              ref={videoLocalRef}
              autoPlay
              className="aspect-video w-[14rem] object-fill"
            ></video>
          </section>
          <section className="fade-in-up fixed bottom-[8%] z-[100] h-fit w-full flex-col bg-transparent">
            <span className="flex justify-center space-x-4">
              <img
                src={CAMERA_ON_ICON}
                className="h-12 w-12 cursor-pointer rounded-full bg-gray-400 p-2"
                alt=""
                onClick={() => handleCall(conversationId!)}
              />
              <img
                src={CAMERA_OFF_ICON}
                className="h-12 w-12 cursor-pointer rounded-full bg-white p-2"
                alt=""
                onClick={toggleVideo}
              />
              <img
                src={MIC_ON_ICON}
                className="h-12 w-12 cursor-pointer rounded-full bg-gray-400 p-2"
                alt=""
              />
              <img
                src={MIC_OFF_ICON}
                className="h-12 w-12 cursor-pointer rounded-full bg-white p-2"
                alt=""
              />
              <img
                src={PHONE_DOWN_ICON}
                className="h-12 w-12 cursor-pointer rounded-full bg-red-600 p-2"
                alt=""
                onClick={() => {
                  console.log('remote ', remoteStream);
                }}
              />
            </span>
          </section>
          <section className="fade-in-down fixed top-[0] z-[100] h-fit w-full flex-col bg-transparent">
            <span className="flex space-x-4 bg-opacity-10 bg-gradient-to-b from-[#3e3d3d57] to-[#e2e2e23e] px-4 py-2">
              <img
                src={conversationEntity?.imageUrl}
                alt=""
                className="size-[3rem] items-center rounded-full"
              />
              <h3 className="grow">{conversationEntity?.name}</h3>
            </span>
          </section>
        </div>
      ) : (
        <section className="flex size-full h-[100vh] flex-col items-center justify-center bg-black">
          <div className="flex grow flex-col items-center justify-center gap-4">
            <img src={AVATAR} alt="" className="size-[6rem] rounded-full" />
            <h3 className="text-16 font-5 text-white">Nguyen Van An</h3>
          </div>
          <div className="flex gap-6 p-8">
            <span className="flex flex-col items-center justify-center gap-2">
              <img
                src={CAMERA_ON_ICON}
                alt=""
                className="size-[4rem] rounded-full bg-green-500 p-[1rem]"
              />
              <p className="font-5 text-gray-400">Gọi video</p>
            </span>
            <span className="flex flex-col items-center justify-center gap-2">
              <img
                src={CAMERA_ON_ICON}
                alt=""
                className="size-[4rem] rounded-full bg-green-500 p-[1rem]"
              />
              <p className="font-5 text-gray-400">Gọi video</p>
            </span>
          </div>
        </section>
      )}
    </>
  );
}

export default CallingPage;