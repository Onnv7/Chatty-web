// SocketContext.js
import Peer, { MediaConnection } from 'peerjs';
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
import { IncomingCallSocketEntity } from '../../domain/entity/socket.entiry';
import { set } from 'react-hook-form';
import { CallRole } from '../constant/enum';

type PeerContextType = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  ongoingCall: OngoingCallEntity | null;
  handleCall: (conversationId: string) => Promise<void>;
  handleJoinCall: (callerSocketId: string) => Promise<void>;
  myPeer: Peer | null;
  getMediaStream: (facingMode?: string) => Promise<MediaStream | null>;
  callerSocketId: string;
  handleToggleCamera: () => Promise<void>;
  handleEndCall: () => void;
  setCallingRole: (role: CallRole) => void;
  callRole: CallRole | null;
};

const PeerContext = createContext<PeerContextType | null>(null);

export const PeerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId, profile } = useAuthContext();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const { socket } = useSocketContext();
  const conversationSocket = socket('conversation');
  const [ongoingCall, setOngoingCall] = useState<OngoingCallEntity>({
    isRinging: false,
    conversation: { id: '', imageUrl: '', name: '' },
  });
  const [myPeer, setMyPeer] = useState<Peer | null>(null);
  const [callerSocketId, setCallerSocketId] = useState<string>('');
  const [calleePeerId, setCalleePeerId] = useState<string>('');
  const [callerPeerId, setCallerPeerId] = useState<string>('');
  const [callRole, setCallRole] = useState<CallRole | null>(null);
  const [initFirstCalling, setInitFirstCalling] = useState<boolean>(true);
  const [reconnect, setReconnect] = useState<boolean>(false);
  const [calling, setCalling] = useState<MediaConnection | null>(null);
  const setCallingRole = (role: CallRole) => {
    setCallRole(role);
  };
  const getMediaStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return stream;
  };
  const handleToggleCamera = async () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        if (track.enabled) {
          track.stop();
        }
      });
      setLocalStream(null);
    } else {
      const stream = await getMediaStream();
      console.log('stream bat 4');
      setLocalStream(stream);
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
      const stream = await getMediaStream();
      console.log('stream bat 1');
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
  const resetState = () => {
    if (remoteStream) {
      console.log('tawst remoteStream');
      remoteStream.getVideoTracks().forEach((track) => {
        if (track.enabled) {
          track.stop();
        }
      });
      setRemoteStream(null);
    }
    setOngoingCall({
      isRinging: false,
      conversation: { id: '', imageUrl: '', name: '' },
    });
    if (myPeer) {
      console.log('tawst myPeer');
      myPeer.destroy();
      setMyPeer(null);
    }
    setCallRole(null);
    setCalleePeerId('');
    setCallerPeerId('');
    setCallerSocketId('');
  };
  // CALLEE ANSWER CALL
  const handleJoinCall = async (callerSocketId: string) => {
    const stream = await getMediaStream();
    const calleePeer = new Peer(conversationSocket.id!);
    setOngoingCall((prev) => ({ ...prev, isRinging: false }));
    calleePeer.on('open', (id) => {
      if (stream && calleePeer) {
        setMyPeer(calleePeer);
        console.log('stream bat 2');
        setLocalStream(stream);
        setCallRole(CallRole.CALLEE);
        setCallerSocketId(callerSocketId);
      }
    });
  };
  const handleEndCall = () => {
    if (localStream) {
      console.log('tawst localStream');
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
  console.log(
    localStream,
    remoteStream,
    ongoingCall,
    myPeer,
    callerSocketId,
    calleePeerId,
    callerPeerId,
    callRole,
    initFirstCalling,
    reconnect,
    calling,
  );
  useEffect(() => {
    if (myPeer && localStream && initFirstCalling) {
      if (callRole === CallRole.CALLEE) {
        const onCallCallee = async (call: MediaConnection) => {
          call.answer(localStream!);
          setCallerPeerId(call.peer);
          setCalling(call);
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
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
          setRemoteStream(remoteStream);
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
      setInitFirstCalling(false);
    }
  }, [myPeer, localStream, initFirstCalling]);
  useEffect(() => {
    if (calling) {
      calling.on('close', () => {
        console.log('effect end calling');
        resetState();
      });
    }
  }, [calling]);
  useEffect(() => {
    const reconnectPeer = async () => {
      if (reconnect && myPeer) {
        const stream = await getMediaStream();
        console.log('stream bat 3');
        setLocalStream(stream);
        const remotePeerId =
          callRole === CallRole.CALLER ? calleePeerId : callerPeerId;
        const call = myPeer.call(remotePeerId, stream);
        setCalling(call);
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
        });
        setReconnect(false);
        return () => {
          call.close();
        };
      }
    };
    reconnectPeer();
  }, [reconnect]);
  useEffect(() => {
    if (conversationSocket) {
      // callee listening
      conversationSocket.on(
        'receive-phone-call',
        async (data: IncomingCallSocketEntity) => {
          setOngoingCall({
            isRinging: true,
            conversation: {
              id: data.conversation.id,
              imageUrl: data.conversation.imageUrl,
              name: data.conversation.name,
            },
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
      return () => {
        conversationSocket.off('receive-phone-call');
        conversationSocket.off('receive-callee-peer-id');
      };
    }
  }, [conversationSocket.id]);

  return (
    <PeerContext.Provider
      value={{
        handleEndCall: handleEndCall,
        // peer: peer.current,
        // peerId: peerId,
        callerSocketId: callerSocketId,
        handleJoinCall: handleJoinCall,
        handleCall: handleCall,
        callRole: callRole,
        localStream: localStream,
        remoteStream: remoteStream,
        ongoingCall: ongoingCall,
        myPeer: myPeer,
        getMediaStream: getMediaStream,
        setCallingRole: setCallingRole,
        handleToggleCamera: handleToggleCamera,
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
