import { number } from 'zod';
import { InvitationAction } from '../../../common/constant/enum';

export type SendInvitationRequest = {
  senderId: number;
  receiverId: number;
};

export type ProcessInvitationRequest = {
  invitationId: number;
  action: InvitationAction;
};
