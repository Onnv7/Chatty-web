import SEARCH_ICON from '@icon/search_icon.svg';
import { useEffect, useRef, useState } from 'react';
import { formatDateConversation } from '../../../../common/util/date.util';
import { useAuthContext } from '../../../../common/context/auth.context';
import { useCallApi } from '../../../../common/hook/useCallApi';
import { PageEntity } from '../../../../domain/entity/common.entity';
import { conversationRepository } from '../../../../data/repository';
import { ConversationEntity } from '../../../../domain/entity/conversation.entity';
import { getConversationPage } from '../../../../domain/usecase/conversation.usecase';
import { useSearchParams } from 'react-router-dom';
import {
  conversationSelector,
  useConversationDispatch,
  useConversationSelector,
} from '../redux/conversation.store';
import {
  getConversationPageThunk,
  getNextConversationPageThunk,
  setConversationSelected,
} from '../redux/conversation.slice';

const conversationFilterType = ['All', 'Groups'];

function ConversationList() {
  const { userId } = useAuthContext();
  const conversationDispatch = useConversationDispatch();
  const conversationPayload = useConversationSelector(conversationSelector);
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversationType, setConversationType] = useState(0);
  const conversationScrollRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      await conversationDispatch(getConversationPageThunk({ userId: userId! }));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const conversation = conversationPayload.conversationSelected;
    if (conversation?.id !== undefined) {
      setSearchParams({
        id: conversation.id,
      });
    }
  }, [conversationPayload.conversationSelected]);

  async function handleScroll() {
    const pageEntity = conversationPayload.pageEntity;
    if (pageEntity.currentPage < pageEntity.totalPage!) {
      await conversationDispatch(
        getNextConversationPageThunk({ userId: userId! }),
      );
    }
  }

  useEffect(() => {
    const element = conversationScrollRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [conversationPayload.pageEntity]);

  return (
    <div className="flex size-full flex-col rounded-[0.8rem] bg-white px-4 py-2 shadow-md">
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
      <section className="grow overflow-y-auto" ref={conversationScrollRef}>
        {conversationPayload.conversationList.map((conv, index) => {
          const imSender = userId === conv.senderId;
          return (
            <div
              key={conv.id}
              className={`my-4 flex h-[5rem] cursor-pointer items-center gap-2 ${conversationPayload.conversationSelected?.id === conv.id ? 'bg-gray-200' : ''} rounded-xl px-4`}
              onClick={() => {
                conversationDispatch(
                  setConversationSelected({
                    id: conv.id,
                    imageUrl: conv.imageUrl,
                    roomName: conv.name,
                  }),
                );
                setSearchParams({ id: conv.id });
              }}
            >
              <div className="relative size-[3rem]">
                <img
                  src={conv.imageUrl}
                  alt=""
                  className="size-full rounded-full object-cover"
                />
                <div className="absolute right-[0.2rem] top-[78%] size-[0.8rem] rounded-full border-[2px] border-white bg-green-500"></div>
              </div>
              <div className="flex grow flex-col">
                <div className="flex justify-between">
                  <h3 className="text-10 grow font-5">{conv.name}</h3>
                  <p className="text-gray-400">
                    {formatDateConversation(new Date(conv.lastSendAt))}
                  </p>
                </div>
                <div className="grow overflow-hidden text-ellipsis">
                  <h3
                    className={`${imSender ? 'text-gray-500' : 'font-5'} max-w-[200px] truncate text-9`}
                  >
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
