// SocketContext.js
import Peer from 'peerjs';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

type PeerContextType = {
  peer: Peer;
  peerId: string;
};

const PeerContext = createContext<PeerContextType | null>(null);

export const PeerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [peerId, setPeerId] = useState<string>('');
  const peer = useRef<Peer>(new Peer());

  const initPeer = () => {
    peer.current.on('open', (id) => {
      console.log('My peer ID is:', id);
      setPeerId(id);
    });
    peer.current.on('error', (err) => {
      console.error('Peer error:', err);
    });
  };
  useEffect(() => {
    initPeer();
    return () => {
      if (peer.current) {
        peer.current.destroy();
      }
    };
  }, []);
  return (
    <PeerContext.Provider value={{ peer: peer.current, peerId: peerId }}>
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
