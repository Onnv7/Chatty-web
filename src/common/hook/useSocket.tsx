// import React, { useRef, useEffect, useContext } from 'react';
// import { Socket } from 'socket.io-client';
// import { useSocketContext } from '../context/socket.context';

// export const useSocket = (namespace: string) => {
//   const { socket, disconnectSocket } = useSocketContext();
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     socketRef.current = socket(namespace);

//     return () => {
//       disconnectSocket(namespace);
//     };
//   }, [namespace, socket]);

//   const onEvent = (event: string, callback: (...args: any[]) => void) => {
//     socketRef.current?.on(event, callback);
//   };

//   const emitEvent = (event: string, ...data: any[]) => {
//     socketRef.current?.emit(event, ...data);
//   };

//   return { socket: socketRef.current, onEvent, emitEvent };
// };
