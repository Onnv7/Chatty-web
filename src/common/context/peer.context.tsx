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
  const [callRole, setCallRole] = useState<CallRole | null>(null);

  const getMediaStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return stream;
  };

  const handleCall = useCallback(
    async (conversationId: string) => {
      if (!conversationSocket) {
        console.log('Conversation socket is not connected');
        return;
      }
      if (!profile) {
        console.log('Caller profile is not set yet');
        return;
      }
      const stream = await getMediaStream();

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
  useEffect(() => {
    if (myPeer && localStream) {
      if (callRole === CallRole.CALLEE) {
        myPeer.on('call', async (call) => {
          call.answer(localStream!);

          // setMyCall(call);
          call.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
          });
        });
        conversationSocket.emit('callee-share-peer-id', {
          calleePeerId: myPeer.id,
          callerSocketId: callerSocketId,
        });
        return () => {
          myPeer.off('call', async (call) => {
            call.answer(localStream!);
            // setMyCall(call);
            call.on('stream', (remoteStream) => {
              setRemoteStream(remoteStream);
            });
          });
        };
      } else if (callRole === CallRole.CALLER) {
        const call = myPeer.call(calleePeerId, localStream);
        // setMyCall(call)
        call.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
        });
        return () => {
          call.close();
        };
      }
    }
  }, [myPeer, localStream]);

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
        // peer: peer.current,
        // peerId: peerId,
        callerSocketId: callerSocketId,
        handleJoinCall: handleJoinCall,
        handleCall: handleCall,
        localStream: localStream,
        remoteStream: remoteStream,
        ongoingCall: ongoingCall,
        myPeer: myPeer,
        getMediaStream: getMediaStream,
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
