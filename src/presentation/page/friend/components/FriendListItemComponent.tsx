import ADD_FRIEND_ICON from '@icon/add_friend_icon.svg';
import SEND_ADD_FRIEND_ICON from '@icon/send_add_friend_icon.svg';
import MESSAGE_ICON from '@icon/message_icon.svg';

function FriendListItemComponent() {
  return (
    <div className="mx-auto flex w-[60%] items-center rounded-[3rem] border-[1px] px-2 py-2 shadow-[0px_0px_5px_-1px_rgba(0,0,0,0.3)]">
      <img
        src={
          'https://editorial.uefa.com/resources/027c-16d30c80a3e5-8717973e3fb0-1000/portugal_v_france_-_uefa_euro_2020_group_f.jpeg'
        }
        alt=""
        className="mr-2 size-[3.2rem] rounded-full object-cover"
      />
      <h3 className="mx-4 grow text-14 font-5">Name</h3>
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
