import ADD_FRIEND_ICON from '@icon/add_friend_icon.svg';
import SEND_ADD_FRIEND_ICON from '@icon/send_add_friend_icon.svg';
import MESSAGE_ICON from '@icon/message_icon.svg';
import { FriendSearchEntity } from '../../../../domain/entity/friend.entity';
import { Gender } from '../../../../common/constant/enum';
type FriendListItemComponentProps = {
  data: FriendSearchEntity;
};
function FriendListItemComponent({ data }: FriendListItemComponentProps) {
  return (
    <div
      className={`pi mx-auto flex w-[60%] items-center border-b-[1px] px-2 py-2 ${data.gender === Gender.FEMALE ? 'shadow-[0px_3px_5px_-0px_rgba(255,2,246,0.3)]' : 'shadow-[0px_3px_5px_-0px_rgba(7,218,255,0.3)]'}`}
    >
      <img
        src={data.avatarUrl}
        alt=""
        className="mr-2 size-[3.2rem] rounded-full object-cover"
      />
      <h3 className="mx-4 grow text-14 font-5">{data.fullName}</h3>
      <span className="mr-2">
        <img
          src={MESSAGE_ICON}
          alt=""
          className="mx-2 inline-block size-[1.4rem] cursor-pointer rounded-full object-cover"
        />
        <img
          src={ADD_FRIEND_ICON}
          alt=""
          className="mx-2 inline-block size-[1.4rem] cursor-pointer rounded-full object-cover"
        />
      </span>
    </div>
  );
}

export default FriendListItemComponent;
