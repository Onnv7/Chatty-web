import REJECT_ICON from '@icon/reject_icon.svg';
import ACCEPT_ICON from '@icon/check_icon.svg';
import { FriendInvitationEntity } from '../../../../domain/entity/friend.entity';
import { useCallApi } from '../../../../common/hook/useCallApi';
import {
  InvitationAction,
  Relationship,
} from '../../../../common/constant/enum';
import {
  processInvitation,
  sendInvitation,
} from '../../../../domain/usecase/friend.usecase';
import { useAuthContext } from '../../../../common/context/auth.context';
import { useState } from 'react';
type SendInvitationComponentProps = {
  entity: FriendInvitationEntity;
};
function SendInvitationComponent({ entity }: SendInvitationComponentProps) {
  const { userId } = useAuthContext();
  const sendInvitationApi = useCallApi();

  const [isRevoked, setIsRevoked] = useState(false);

  async function handleSendInvitation(receiverId: number) {
    sendInvitationApi.callApi(async () => {
      const data = await sendInvitation(userId!, receiverId);
      setIsRevoked(true);
    });
  }
  return (
    <>
      {!isRevoked && (
        <>
          <div className="flex items-center justify-center px-4">
            <img
              src={entity.avatarUrl}
              alt=""
              className="size-[3.6rem] rounded-xl object-cover object-center"
            />
            <h3 className="mx-4 my-4 grow text-12 font-5">{entity.fullName}</h3>
            <span className="flex items-center justify-center gap-2">
              <button
                className="rounded-xl border-[1px] bg-black px-2 py-1 uppercase text-white"
                onClick={() => handleSendInvitation(entity.profileId)}
              >
                Revoke
              </button>
            </span>
          </div>
          <hr className="my-2" />
        </>
      )}
    </>
  );
}

export default SendInvitationComponent;
