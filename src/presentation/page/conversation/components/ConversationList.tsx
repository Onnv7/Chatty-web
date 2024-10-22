import SEARCH_ICON from '@icon/search_icon.svg';
import { useEffect, useRef, useState } from 'react';
import {
  formatDateConversation,
  timeAgo,
} from '../../../../common/util/date.util';
import { useAuthContext } from '../../../../common/context/auth.context';

import { useSearchParams } from 'react-router-dom';
import {
  conversationSelector,
  useConversationDispatch,
  useConversationSelector,
} from '../redux/conversation.store';
import {
  getConversationPageThunk,
  getNextConversationPageThunk,
  refreshCallConversationList,
  setConversationSelected,
  updateNewActiveFriend,
} from '../redux/conversation.slice';
import { ActiveStatus } from '../../../../common/constant/enum';
import { useSocketContext } from '../../../../common/context/socket.context';
import { SocketNamespaces } from '../../../../common/constant/socket.constant';
import { unwrapResult } from '@reduxjs/toolkit';
import { emitJoinTrackingRoom } from '../../../../domain/usecase/app.usecase';
import { TrackingFriendSocketData } from '../../../../domain/entity/common.entity';

const conversationFilterType = ['All', 'Groups'];

function ConversationList() {
  const { userId } = useAuthContext();
  const conversationDispatch = useConversationDispatch();
  const conversationPayload = useConversationSelector(conversationSelector);
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationId = searchParams.get('id');

  const friendId = searchParams.get('friend');
  const [conversationType, setConversationType] = useState(0);
  const conversationScrollRef = useRef<HTMLSelectElement>(null);
  const { socket } = useSocketContext();

  const conversationSocket = socket(SocketNamespaces.conversation);

  useEffect(() => {
    const fetchData = async () => {
      if (conversationPayload.reloadConversationList) {
        await conversationDispatch(
          getConversationPageThunk({
            userId: userId!,
          }),
        );
        conversationDispatch(refreshCallConversationList(false));
        if (
          conversationId === undefined &&
          !conversationId &&
          !friendId &&
          conversationPayload.conversationList[0]?.id
        ) {
          conversationDispatch(
            setConversationSelected(
              conversationPayload.conversationList[0]?.id,
            ),
          );

          setSearchParams({ id: conversationPayload.conversationList[0]?.id });
        }
      }
    };
    fetchData();
  }, [conversationPayload.reloadConversationList]);

  useEffect(() => {
    if (conversationSocket.connected) {
      emitJoinTrackingRoom(
        conversationPayload.conversationList,
        conversationSocket,
      );
      conversationSocket.on(
        `active-status-friend`,
        (data: TrackingFriendSocketData) => {
          conversationDispatch(
            updateNewActiveFriend({
              activeStatus: data.activeStatus,
              friendId: data.senderId,
            }),
          );
        },
      );
    }

    if (
      conversationId !== undefined &&
      !conversationId &&
      !friendId &&
      conversationPayload.conversationList[0]?.id
    ) {
      conversationDispatch(
        setConversationSelected(conversationPayload.conversationList[0]?.id),
      );

      setSearchParams({ id: conversationPayload.conversationList[0]?.id });
    }
  }, [
    conversationSocket.connected,
    conversationPayload.conversationList,
    conversationPayload.reloadConversationList,
  ]);

  useEffect(() => {
    conversationDispatch(setConversationSelected(conversationId));
  }, [conversationId, friendId]);

  async function handleScroll() {
    const pageEntity = conversationPayload.pageEntity;
    if (pageEntity.currentPage < pageEntity.totalPage!) {
      await conversationDispatch(
        getNextConversationPageThunk({
          userId: userId!,
        }),
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
              className={`my-4 flex h-[5rem] cursor-pointer items-center gap-2 ${conversationPayload.conversationSelected === conv.id ? 'bg-gray-200' : ''} rounded-xl px-4`}
              onClick={() => {
                setSearchParams({ id: conv.id });
              }}
            >
              <div className="bg-red relative size-[3rem]">
                <img
                  src={conv.imageUrl}
                  alt=""
                  className="size-full rounded-full object-cover"
                />
                {conv.activeStatus === ActiveStatus.ONLINE ? (
                  <div className="absolute right-[0.2rem] top-[78%] size-[0.8rem] rounded-full border-[2px] border-white bg-green-500"></div>
                ) : (
                  <p className="absolute left-[-10%] top-[80%] min-w-[3.5rem] rounded-xl bg-cyan-300 bg-opacity-70 px-1 text-center text-7">
                    {timeAgo(new Date(conv.lastActiveAt))}
                  </p>
                )}
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
