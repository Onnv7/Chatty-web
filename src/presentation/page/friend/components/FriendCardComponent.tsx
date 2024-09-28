import { useState } from 'react';
import { FriendSearchEntity } from '../../../../domain/entity/friend.entity';
import {
  Gender,
  InvitationAction,
  Relationship,
} from '../../../../common/constant/enum';
import { useAuthContext } from '../../../../common/context/auth.context';
import {
  processInvitation,
  sendInvitation,
} from '../../../../domain/usecase/friend.usecase';
import { useCallApi } from '../../../../common/hook/useCallApi';
import PopupComponent from '../../../components/PopupComponent';

type FriendCardComponentProps = {
  data: FriendSearchEntity;
};

function FriendCardComponent({ data }: FriendCardComponentProps) {
  const [relationship, setRelationship] = useState(data.relationship);
  const { userId } = useAuthContext();
  const sendInvitationApi = useCallApi();
  const processInvitationApi = useCallApi();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  async function handleSendInvitation(
    receiverId: number,
    relationship: Relationship,
  ) {
    if (relationship === Relationship.PENDING) {
      setIsPopupOpen(true);
    } else {
      sendInvitationApi.callApi(async () => {
        const data = await sendInvitation(userId!, receiverId);
        setRelationship((prev) => {
          if (prev === Relationship.SEND) return Relationship.NONE;
          else if (prev === Relationship.NONE) return Relationship.SEND;
          return Relationship.FRIEND;
        });
      });
    }
  }

  async function handleProcessInvitation(
    invitationId: number,
    action: InvitationAction,
  ) {
    processInvitationApi.callApi(async () => {
      const data = await processInvitation({ invitationId, action });
      setIsPopupOpen(false);
      const newRelationship =
        action === InvitationAction.ACCEPT
          ? Relationship.FRIEND
          : Relationship.NONE;
     
      setRelationship(newRelationship);
    });
  }

  return (
    <span
      className={`m-2 flex w-[12rem] flex-col items-center rounded-[1rem] border-[1px] px-2 py-8 ${data.gender === Gender.FEMALE ? 'shadow-[0px_3px_5px_-0px_rgba(255,2,246,0.3)]' : 'shadow-[0px_3px_5px_-0px_rgba(7,218,255,0.3)]'}`}
    >
      <img
        src={data.avatarUrl}
        alt=""
        className="size-[3.6rem] rounded-xl object-cover object-center"
      />
      <h3 className="my-4 text-12 font-5">{data.fullName}</h3>
      <div className="mx-auto flex w-[10rem] gap-2">
        <button className="grow basis-[5rem] select-none rounded-[1.2rem] border-[1.4px] border-primary-5 px-2 py-1 text-8 text-primary-5">
          Message
        </button>
        {relationship !== Relationship.FRIEND && (
          <button
            className={`grow basis-[5rem] select-none rounded-[1.2rem] ${
              relationship === Relationship.SEND
                ? 'bg-[#000000]'
                : relationship === Relationship.PENDING
                  ? 'bg-[#000000]'
                  : 'bg-[#21b9f0]'
            } duration-5000 px-2 py-1 text-8 text-gray-100 transition-all active:scale-[0.9]`}
            onClick={() => handleSendInvitation(data.profileId, relationship)}
          >
            {relationship === Relationship.SEND
              ? 'Revoke'
              : relationship === Relationship.PENDING
                ? 'Pending'
                : 'Add friend'}
          </button>
        )}
        <PopupComponent
          isOpen={isPopupOpen}
          closeWhenClickOutSite={true}
          onClose={() => {
            setIsPopupOpen(false);
          }}
          title={'Invitation'}
          content={'Do you want to accept this invitation?'}
          secondaryButton={{
            onClick: () =>
              handleProcessInvitation(
                data.invitationId!,
                InvitationAction.REFUSE,
              ),
          }}
          primaryButton={{
            onClick: () =>
              handleProcessInvitation(
                data.invitationId!,
                InvitationAction.ACCEPT,
              ),
          }}
        />
      </div>
    </span>
  );
}

export default FriendCardComponent;
