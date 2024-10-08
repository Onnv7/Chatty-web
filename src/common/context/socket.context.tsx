// SocketContext.js
import Peer from 'peerjs';
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: (namespace: string) => Socket;
  disconnectSocket: (namespace: string) => void;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sockets = useRef<{ [key: string]: Socket }>({});
  const peer = useRef<Peer>(new Peer());

  const connectSocket = (namespace: string) => {
    if (!sockets.current[namespace]) {
      const socket = io(`http://localhost:1001/${namespace}`);
      socket.on('connect', () => {
        // console.log(`Connecting to ${namespace}`, socket.id);
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
  };

  const socket = (namespace: string) => connectSocket(namespace);
  useEffect(() => {
    const peerCaller = peer.current;

    peerCaller.on('open', (id) => {
      // console.log('My peer ID is:', id);
    });

    return () => {
      peerCaller.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, disconnectSocket }}>
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
