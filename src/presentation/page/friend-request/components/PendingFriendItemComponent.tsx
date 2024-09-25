import ACCEPT_ICON from '@icon/accept_icon.svg';
import REJECT_ICON from '@icon/reject_icon.svg';

function PendingFriendItemComponent() {
  return (
    <>
      <div className="flex items-center px-4">
        <img
          src={
            'https://editorial.uefa.com/resources/027c-16d30c80a3e5-8717973e3fb0-1000/portugal_v_france_-_uefa_euro_2020_group_f.jpeg'
          }
          alt=""
          className="size-[3.6rem] rounded-xl object-cover object-center"
        />
        <h3 className="mx-4 my-4 grow text-12 font-5">Ronaldol</h3>
        <span className="flex gap-2">
          <img
            src={ACCEPT_ICON}
            alt=""
            className="size-[1.4rem] cursor-pointer"
          />
          <img
            src={REJECT_ICON}
            alt=""
            className="size-[1.4rem] cursor-pointer"
          />
        </span>
      </div>
      <hr className="my-2" />
    </>
  );
}

export default PendingFriendItemComponent;
