// SocketContext.js
import Peer from 'peerjs';
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: (namespace: 'conversation' | string) => Socket;
  disconnectSocket: (namespace: 'conversation' | string) => void;
  peer: Peer;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sockets = useRef<{ [key: string]: Socket }>({});
  const peer = useRef<Peer>(new Peer());

  const connectSocket = (namespace: 'conversation' | string) => {
    if (!sockets.current[namespace]) {
      const socket = io(`http://localhost:1001/${namespace}`);
      socket.on('connect', () => {
        console.log(
          `Connecting to conversation socket ${namespace}`,
          socket.id,
        );
      });
      sockets.current[namespace] = socket;
    }
    return sockets.current[namespace];
  };

  const disconnectSocket = (namespace: string) => {
    const socket = sockets.current[namespace];
    if (socket) {
      socket.disconnect();
      delete sockets.current[namespace];
    }
    initPeer();
  };

  const initPeer = () => {
    const peerCaller = peer.current;
    peerCaller.on('open', (id) => {
      console.log('My peer ID is:', id);
    });
  };

  useEffect(() => {
    socket('conversation');
  }, []);

  const socket = (namespace: 'conversation' | string) =>
    connectSocket(namespace);
  // useEffect(() => {
  //   const conversationSocket = socket('conversation');
  //   conversationSocket.on('receive-phone-call', (data) => {

  //   });
  // }, []);
  return (
    <SocketContext.Provider
      value={{ socket, disconnectSocket, peer: peer.current }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
