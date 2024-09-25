import React, { useState } from 'react';
import PendingFriendItemComponent from './components/PendingFriendItemComponent';

function FriendInvitationPage() {
  const [featureMode, setFeatureMode] = useState(0);
  return (
    <div className="flex size-full flex-col rounded-xl bg-white shadow-[0px_0px_20px_-0px_rgba(0,0,0,0.3)]">
      <h1 className="mx-8 my-4 text-16 font-7">Invitation</h1>
      <section className="flex items-center justify-center gap-4">
        <div className="relative">
          <button
            className={`w-[12rem] select-none text-12 font-5 uppercase ${featureMode === 0 ? 'text-primary-5' : ''} transition-colors duration-700`}
            onClick={() => setFeatureMode(0)}
          >
            Pending Friend
          </button>
          <button
            className={`w-[12rem] select-none text-12 font-5 uppercase ${featureMode === 1 ? 'text-primary-5' : ''} transition-colors duration-700`}
            onClick={() => setFeatureMode(1)}
          >
            Your Invitation
          </button>
          <div
            className={`absolute bottom-[-4px] left-0 w-[12rem] border-[2px] border-primary-3 ${featureMode === 1 ? 'translate-x-[12rem]' : ''} transition-transform duration-700`}
          ></div>
        </div>
      </section>
      <hr />
      <section className="mx-auto w-[60%] grow overflow-auto py-10">
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
        <PendingFriendItemComponent />
      </section>
    </div>
  );
}

export default FriendInvitationPage;
