import { useState } from 'react';

function FriendCardComponent() {
  const [isSend, setIsSend] = useState(false);
  return (
    <span className="m-2 flex w-[12rem] flex-col items-center rounded-[1rem] border-[1px] px-2 py-8 shadow-[0px_0px_5px_-1px_rgba(0,0,0,0.3)]">
      <img
        src={
          'https://editorial.uefa.com/resources/027c-16d30c80a3e5-8717973e3fb0-1000/portugal_v_france_-_uefa_euro_2020_group_f.jpeg'
        }
        alt=""
        className="size-[3.6rem] rounded-xl object-cover object-center"
      />
      <h3 className="my-4 text-12 font-5">Ronaldol</h3>
      <div className="mx-auto flex w-[10rem] gap-2">
        <button className="basis-[5rem] select-none rounded-[1.2rem] border-[1.4px] border-primary-5 px-2 py-1 text-8 text-primary-5">
          Message
        </button>
        <button
          className={`basis-[5rem] select-none rounded-[1.2rem] ${isSend ? 'bg-[#f03333]' : 'bg-[#19b9e5]'} duration-5000 px-2 py-1 text-8 text-gray-100 transition-all active:scale-[0.9]`}
          onClick={() => setIsSend((prev) => !prev)}
        >
          {isSend ? 'Revoke' : 'Add friend'}
        </button>
      </div>
    </span>
  );
}

export default FriendCardComponent;
