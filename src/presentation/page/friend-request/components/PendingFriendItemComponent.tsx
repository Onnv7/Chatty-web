import REJECT_ICON from '@icon/reject_icon.svg';
import ACCEPT_ICON from '@icon/check_icon.svg';
import SEND_MSG_ICON from '@icon/send_message_icon_fill_blue.svg';
import { FriendInvitationEntity } from '../../../../domain/entity/friend.entity';
import { useCallApi } from '../../../../common/hook/useCallApi';
import {
  InvitationAction,
  Relationship,
} from '../../../../common/constant/enum';
import { processInvitation } from '../../../../domain/usecase/friend.usecase';
import { useState } from 'react';
import { toastNotification } from '../../../../common/util/notification.util';
type PendingFriendItemComponentProps = {
  entity: FriendInvitationEntity;
};
function PendingFriendItemComponent({
  entity,
}: PendingFriendItemComponentProps) {
  const [action, setAction] = useState<InvitationAction>();
  const processInvitationApi = useCallApi();
  async function handleProcessInvitation(
    invitationId: number,
    action: InvitationAction,
  ) {
    processInvitationApi.callApi(async () => {
      const data = await processInvitation({ invitationId, action });
      setAction(action);
      toastNotification({
        msg:
          action === InvitationAction.ACCEPT
            ? `Congratulations to you and ${entity.fullName} on becoming friends.`
            : '',
      });
    });
  }
  return (
    <>
      {(!action || action === InvitationAction.ACCEPT) && (
        <>
          <div className="flex items-center justify-center px-4">
            <img
              src={entity.avatarUrl}
              alt=""
              className="size-[3.6rem] rounded-xl object-cover object-center"
            />
            <h3 className="mx-4 my-4 grow text-12 font-5">{entity.fullName}</h3>
            <span className="flex items-center justify-center gap-2">
              {action === InvitationAction.ACCEPT ? (
                <img
                  src={SEND_MSG_ICON}
                  alt=""
                  className="h-[1.8rem] w-[3.2rem] cursor-pointer rounded-2xl"
                />
              ) : (
                <>
                  <img
                    src={REJECT_ICON}
                    alt=""
                    className="h-[1.8rem] w-[3.2rem] cursor-pointer rounded-2xl border-[0px] border-black bg-[#cefdff] px-2 py-2"
                    onClick={() =>
                      handleProcessInvitation(
                        entity.invitationId,
                        InvitationAction.REFUSE,
                      )
                    }
                  />
                  <img
                    src={ACCEPT_ICON}
                    alt=""
                    className="h-[1.8rem] w-[3.2rem] cursor-pointer rounded-2xl border-[1px] bg-black px-2 py-1"
                    onClick={() =>
                      handleProcessInvitation(
                        entity.invitationId,
                        InvitationAction.ACCEPT,
                      )
                    }
                  />
                </>
              )}
            </span>
          </div>
          <hr className="my-2" />
        </>
      )}
    </>
  );
}

export default PendingFriendItemComponent;
