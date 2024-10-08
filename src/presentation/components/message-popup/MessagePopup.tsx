import React from 'react';
import TextingComponent from '../TextingComponent';
type MessagePopupProps = {
  friendId: number;
};
function MessagePopup({ friendId }: MessagePopupProps) {
  return (
    <div className="fixed inset-0 flex size-full items-center justify-center bg-black bg-opacity-20">
      <section className="min-w-[24rem] rounded-xl bg-white">
        <section className="flex items-center">
          <img
            src={
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb-NGEQDekk2BwsllLjk4tcIM_BPIzXECdsg&s'
            }
            alt=""
            className="size-[3rem] rounded-full"
          />
          <p className="font-5">Nguyen Van An</p>
        </section>
        <hr />
        <section>
          {/* <TextingComponent
            conversationId={''}
            onAfterSend={function (data: any): void {}}
          /> */}
        </section>
      </section>
    </div>
  );
}

export default MessagePopup;
