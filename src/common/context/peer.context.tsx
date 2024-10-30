// SocketContext.js
import Peer, { MediaConnection } from 'peerjs';
import DO_CALLING_AUDIO from '@audio/do_calling_audio.mp3';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useSocketContext } from './socket.context';
import { OngoingCallEntity } from '../../domain/entity/common.entity';
import { useAuthContext } from './auth.context';
import {
  CalleeRejectCallSocketEntity,
  IncomingCallSocketEntity,
} from '../../domain/entity/socket.entiry';
import { set } from 'react-hook-form';
import { CallRole } from '../constant/enum';

type PeerContextType = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  ongoingCall: OngoingCallEntity | null;
  handleCall: (conversationId: string) => Promise<void>;
  handleRejectCall: () => void;
  handleJoinCall: (callerSocketId: string) => Promise<void>;
  myPeer: Peer | null;
  getMediaStream: (video?: boolean) => Promise<MediaStream | null>;
  callerSocketId: string;
  handleToggleCamera: () => Promise<void>;
  handleToggleMic: () => void;
  handleEndCall: () => void;
  setCallingRole: (role: CallRole) => void;
  resetState: () => void;
  callRole: CallRole | null;
  reconnect: boolean | undefined;
};

const PeerContext = createContext<PeerContextType | null>(null);

export const PeerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [doCallingAudio, setDoCallingAudio] = useState(
    new Audio(DO_CALLING_AUDIO),
  );
  const { userId, profile } = useAuthContext();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const { socket } = useSocketContext();
  const conversationSocket = socket('conversation');
  const [ongoingCall, setOngoingCall] = useState<OngoingCallEntity>({
    isRinging: false,
    conversation: { id: '', imageUrl: '', name: '' },
    connected: false,
  });
  const [myPeer, setMyPeer] = useState<Peer | null>(null);
  const [callerSocketId, setCallerSocketId] = useState<string>('');
  const [calleePeerId, setCalleePeerId] = useState<string>('');
  const [callerPeerId, setCallerPeerId] = useState<string>('');
  const [callRole, setCallRole] = useState<CallRole | null>(null);
  const [initFirstCalling, setInitFirstCalling] = useState<boolean>(true);
  const [reconnect, setReconnect] = useState<boolean>();
  const [calling, setCalling] = useState<MediaConnection | null>(null);
  const [callingClose, setCallingClose] = useState<boolean>(false);
  const [cameraOn, setCameraOn] = useState<boolean>(false);
  const [audioOn, setAudioOn] = useState<boolean>(false);
  const [acceptCall, setAcceptCall] = useState<boolean>();
  const setCallingRole = (role: CallRole) => {
    setCallRole(role);
  };
  const handleToggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
    }
  };
  const getMediaStream = async (video?: boolean) => {
    console.log('bat video', video);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: video ?? true,
    });
    return stream;
  };
  const handleToggleCamera = async () => {
    if (localStream) {
      localStream.getVideoTracks().map((track) => {
        track.stop();
      });
      setLocalStream(null);
      console.log('tat cam');
    } else {
      setReconnect(true);
    }
  };
  const handleCall = useCallback(
    async (conversationId: string) => {
      if (!conversationSocket) {
        console.error('Conversation socket is not connected');
        return;
      }
      if (!profile) {
        console.error('Caller profile is not set yet');
        return;
      }

      const stream = await getMediaStream(false);
      doCallingAudio.play();
      doCallingAudio.loop = true;
      setLocalStream(stream);
      setCallRole(CallRole.CALLER);

      conversationSocket.emit('init-phone-call', {
        caller: {
          id: userId,
          fullName: profile.firstName + ' ' + profile.lastName,
          avatarUrl: profile.avatarUrl,
          peerId: 'callerPeer?.id',
        },
        conversationId: conversationId,
      });
    },
    [profile, userId, conversationSocket],
  );
  const handleRejectCall = useCallback(() => {
    if (conversationSocket) {
      conversationSocket.emit('callee-reject-call-caller', {
        callerSocketId: callerSocketId,
        calleeId: userId,
      });
    }
  }, [callerSocketId, callerPeerId, conversationSocket]);
  const resetState = () => {
    console.log('resteing calling');
    if (remoteStream) {
      remoteStream.getVideoTracks().forEach((track) => {
        if (track.enabled) {
          track.stop();
        }
      });
      setRemoteStream(null);
    }
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        if (track.enabled) {
          track.stop();
        }
      });
      setRemoteStream(null);
    }
    setOngoingCall({
      isRinging: false,
      conversation: { id: '', imageUrl: '', name: '' },
      connected: false,
    });
    if (myPeer) {
      myPeer.destroy();
      setMyPeer(null);
    }
    setCallRole(null);
    setCalleePeerId('');
    setCallerPeerId('');
    setCallerSocketId('');
    if (doCallingAudio.played) {
      doCallingAudio.pause();
      doCallingAudio.currentTime = 0;
    }
  };
  // CALLEE ANSWER CALL
  const handleJoinCall = async (callerSocketId: string) => {
    const stream = await getMediaStream();
    const calleePeer = new Peer(conversationSocket.id!);
    setOngoingCall((prev) => ({ ...prev, isRinging: false }));
    calleePeer.on('open', (id) => {
      if (stream && calleePeer) {
        setMyPeer(calleePeer);
        setLocalStream(stream);
        setCallRole(CallRole.CALLEE);
        setCallerSocketId(callerSocketId);
      }
    });
  };
  const handleEndCall = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        if (track.enabled) {
          track.stop();
        }
      });
      setLocalStream(null);
    }
    if (calling) {
      calling.close();
    }
  };
  useEffect(() => {
    console.log('🚀 ~ useEffect ~ initFirstCalling:', initFirstCalling);
    if (myPeer && localStream) {
      calling?.peerConnection.getSenders().forEach((sender) => {
        sender.replaceTrack(localStream!.getVideoTracks()[0]);
      });
      if (callRole === CallRole.CALLEE) {
        const onCallCallee = async (call: MediaConnection) => {
          call.answer(localStream!);
          setCallerPeerId(call.peer);
          setCalling(call);
          call.on('stream', (remoteStream) => {
            console.log('nhan duoc stream', remoteStream);
            setRemoteStream(remoteStream);
            setOngoingCall((prev) => ({ ...prev, connected: true }));
          });
        };
        myPeer.on('call', onCallCallee);
        conversationSocket.emit('callee-share-peer-id', {
          calleePeerId: myPeer.id,
          callerSocketId: callerSocketId,
        });
        return () => {
          calling?.close();
          myPeer.off('call', onCallCallee);
        };
      } else if (callRole === CallRole.CALLER) {
        const call = myPeer.call(calleePeerId, localStream);
        setCalling(call);
        call.on('stream', (remoteStream) => {
          console.log('caller nhan stream', remoteStream.getVideoTracks());
          if (doCallingAudio.played) {
            doCallingAudio.pause();
            doCallingAudio.currentTime = 0;
          }
          setRemoteStream(remoteStream);
          setOngoingCall((prev) => ({ ...prev, connected: true }));
        });
        const onCallCaller = async (call: MediaConnection) => {
          setCalling(call);
          call.answer(localStream!);
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
          });
        };
        myPeer.on('call', onCallCaller);

        return () => {
          call.close();
          myPeer.off('call', onCallCaller);
        };
      }
    }
  }, [myPeer, localStream, initFirstCalling]);

  useEffect(() => {
    console.log('set lai toan bo state, reconnect = ', callingClose, reconnect);
    if (callingClose) {
      console.log('oki');
      if (reconnect === false) {
        resetState();
      }
      setCallingClose(false);
    }
  }, [callingClose, reconnect]);

  useEffect(() => {
    const reconnectPeer = async () => {
      if (reconnect && myPeer) {
        console.log('reconnecting');
        const stream = await getMediaStream();
        setLocalStream(stream);
        const remotePeerId =
          callRole === CallRole.CALLER ? calleePeerId : callerPeerId;

        const call = myPeer.call(remotePeerId, stream);
        setCalling(call);

        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
        });
        setReconnect(undefined);
        return () => {
          call.close();
        };
      }
    };
    reconnectPeer();
  }, [reconnect]);

  useEffect(() => {
    if (calling) {
      if (reconnect === true) {
        console.log('reconnect1 === true');
      } else if (reconnect === false) {
        console.log('reconnect1 === false');
      } else if (reconnect === undefined) {
        console.log('reconnect1 === undefined');
      }
      calling.on('close', () => {
        console.log('listen calling close');
        setCallingClose(true);
      });
      return () => {
        calling.off('close', () => {
          setCallingClose(true);
        });
      };
    }
  }, [calling, reconnect]);

  useEffect(() => {
    if (conversationSocket.connected) {
      // callee listening
      conversationSocket.on(
        'receive-phone-call',
        async (data: IncomingCallSocketEntity) => {
          console.log('cuoc goi toi', ongoingCall);
          setOngoingCall({
            isRinging: true,
            conversation: {
              id: data.conversation.id,
              imageUrl: data.conversation.imageUrl,
              name: data.conversation.name,
            },
            connected: false,
          });
          setCallRole(CallRole.CALLEE);
          setCallerSocketId(data.conversation.socketId);
        },
      );
      // caller listening
      conversationSocket.on(
        'receive-callee-peer-id',
        async (peerId: string) => {
          const callerPeer = new Peer(conversationSocket.id!);
          if (callerPeer) {
            callerPeer.on('open', (id) => {
              setCalleePeerId(peerId);
              setMyPeer(callerPeer);
            });
          }
        },
      );
      conversationSocket.on(
        'callee-reject-call',
        async (data: CalleeRejectCallSocketEntity) => {
          doCallingAudio.pause();
          doCallingAudio.currentTime = 0;
          console.log('resetState() 3');
          resetState();
        },
      );
      return () => {
        conversationSocket.off('receive-phone-call', () => {
          console.log('off receive-phone-call');
        });
        conversationSocket.off('receive-callee-peer-id');
        conversationSocket.off('callee-reject-call');
      };
    }
  }, [conversationSocket.id]);

  return (
    <PeerContext.Provider
      value={{
        handleEndCall: handleEndCall,
        // peer: peer.current,
        // peerId: peerId,
        reconnect: reconnect,
        callerSocketId: callerSocketId,
        handleJoinCall: handleJoinCall,
        handleRejectCall: handleRejectCall,
        handleCall: handleCall,
        resetState: resetState,
        callRole: callRole,
        localStream: localStream,
        remoteStream: remoteStream,
        ongoingCall: ongoingCall,
        myPeer: myPeer,
        getMediaStream: getMediaStream,
        setCallingRole: setCallingRole,
        handleToggleCamera: handleToggleCamera,
        handleToggleMic: handleToggleMic,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export const usePeerContext = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
