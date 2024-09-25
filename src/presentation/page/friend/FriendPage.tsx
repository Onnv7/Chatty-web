import SEARCH_ICON from '@icon/search_icon.svg';
import GRID_ICON from '@icon/grid_icon.svg';
import GRID_ICON_SELECTED from '@icon/grid_icon_cyan.svg';
import LIST_ICON from '@icon/list_icon.svg';
import LIST_ICON_SELECTED from '@icon/list_icon_cyan.svg';
import { useState } from 'react';
import FriendCardComponent from './components/FriendCardComponent';
import FriendListItemComponent from './components/FriendListItemComponent';

function FriendPage() {
  const [displayMode, setDisplayMode] = useState(0);
  return (
    <div className="flex size-full flex-col rounded-xl bg-white shadow-[0px_0px_20px_-0px_rgba(0,0,0,0.3)]">
      <h1 className="mx-8 my-4 text-16 font-7">Let find your friends</h1>
      <section className="p-2">
        <div className="relative mx-4 rounded-[0.8rem] bg-[#eee8e8] p-2">
          <img src={SEARCH_ICON} alt="" className="absolute size-[1.4rem]" />
          <input
            type="text"
            className="ml-[1.6rem] bg-transparent outline-none"
            placeholder="Search your friends"
          />
        </div>
      </section>
      <hr />
      <section className="flex flex-col mb-3 overflow-hidden grow">
        <div className="mx-auto my-2 flex w-[80%] justify-end gap-4">
          <img
            src={displayMode === 0 ? GRID_ICON_SELECTED : GRID_ICON}
            alt=""
            className="size-[1.5rem] cursor-pointer"
            onClick={() => setDisplayMode(0)}
          />
          <img
            src={displayMode === 1 ? LIST_ICON_SELECTED : LIST_ICON}
            alt=""
            className="size-[1.6rem] cursor-pointer"
            onClick={() => setDisplayMode(1)}
          />
        </div>
        <span className="overflow-auto grow">
          <div className="mx-auto w-[80%]">
            {displayMode === 0 ? (
              <section className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] items-center justify-items-center align-middle">
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
                <FriendCardComponent />
              </section>
            ) : (
              <section className="flex flex-col gap-2">
                <FriendListItemComponent />
                <FriendListItemComponent />
              </section>
            )}
          </div>
        </span>
      </section>
    </div>
  );
}

export default FriendPage;
