export type IncomingCallSocketEntity = {
  conversation: {
    id: string;
    imageUrl: string;
    name: string;
    socketId: string;
    peerId: string;
  };
};

export type ReceiveCalleePeerIdSocketEntity = {};

export type CalleeRejectCallSocketEntity = {
  calleeId: string;
};
