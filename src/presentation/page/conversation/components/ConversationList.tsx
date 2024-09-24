import SEARCH_ICON from '@icon/search_icon.svg';
import { useState } from 'react';
import { formatDateConversation } from '../../../../common/util/date.util';

const userId = 1;
const conversationFilterType = ['All', 'Groups'];
const conversationList = [
  {
    imageUrl:
      'https://editorial.uefa.com/resources/027c-16d30c80a3e5-8717973e3fb0-1000/portugal_v_france_-_uefa_euro_2020_group_f.jpeg',
    name: 'Ronaldo',
    lastMessage: 'Helloword',
    senderId: 1,
    lastSendAt: new Date(),
    seen: true,
  },
  {
    imageUrl:
      'https://editorial.uefa.com/resources/027c-16d30c80a3e5-8717973e3fb0-1000/portugal_v_france_-_uefa_euro_2020_group_f.jpeg',
    name: 'Ronaldo',
    lastMessage: 'Helloword',
    senderId: 2,
    lastSendAt: new Date('2020-12-12'),
    seen: false,
  },
  {
    imageUrl:
      'https://editorial.uefa.com/resources/027c-16d30c80a3e5-8717973e3fb0-1000/portugal_v_france_-_uefa_euro_2020_group_f.jpeg',
    name: 'Ronaldo',
    lastMessage: 'Helloword',
    senderId: 2,
    lastSendAt: new Date('2024-05-12'),
    seen: false,
  },
];

function ConversationList() {
  const [conversationType, setConversationType] = useState(0);

  return (
    <div className="size-full rounded-[0.8rem] bg-white px-4 py-2 shadow-md">
      <section>
        <h3 className="text-16 font-7">Message</h3>
      </section>
      <hr className="my-4" />
      <section>
        <div className="flex rounded-[0.8rem] border-[1px] p-1">
          <img
            src={SEARCH_ICON}
            alt=""
            className="absolute mx-1 size-[1.4rem]"
          />
          <input
            type="text"
            className="ml-8 outline-none"
            placeholder="Search"
          />
        </div>
        <div className="mx-auto my-2 flex w-fit gap-2 rounded-[1.6rem] bg-[#efebeb] px-4 py-2">
          {conversationFilterType.map((item, index) => {
            const isActive = conversationType === index;

            return (
              <span
                key={index} // Thêm key để React nhận diện các phần tử
                className={`z-10 cursor-pointer rounded-[1.4rem] px-4 py-1 transition-all duration-300 ease-in-out ${isActive ? 'bg-white text-blue-500 shadow-md' : 'text-gray-500'}`}
                onClick={() => setConversationType(index)}
              >
                {item}
              </span>
            );
          })}
        </div>
      </section>
      <section>
        {conversationList.map((conv) => {
          const imSender = userId === conv.senderId;
          return (
            <div className="my-4 flex cursor-pointer items-center gap-2">
              <span className="relative">
                <img
                  src={conv.imageUrl}
                  alt=""
                  className="size-[3rem] rounded-full object-cover"
                />
                <div className="absolute right-[0.2rem] top-[78%] size-[0.8rem] rounded-full border-[2px] border-white bg-green-500"></div>
              </span>
              <div className="flex grow flex-col">
                <div className="flex justify-between">
                  <h3 className="text-12 font-5">{conv.name}</h3>
                  <p className="text-gray-400">
                    {formatDateConversation(conv.lastSendAt)}
                  </p>
                </div>
                <div className="flex">
                  <h3 className={`${imSender ? 'text-gray-500' : 'font-5'}`}>
                    {imSender ? 'You: ' + conv.lastMessage : conv.lastMessage}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default ConversationList;
