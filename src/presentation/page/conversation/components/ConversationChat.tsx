import REACT_EMOJI_ICON from '@icon/react_emoji_icon.svg';
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { useSearchParams } from 'react-router-dom';
import { useCallApi } from '../../../../common/hook/useCallApi';
import {
  checkIsAtBottom,
  getConversation,
  getConversationId,
  getMessagePage,
  handleNewMessageInComing,
  reactMessage,
  updateReactionMessage,
} from '../../../../domain/usecase/conversation.usecase';
import { PageEntity } from '../../../../domain/entity/common.entity';
import { useAuthContext } from '../../../../common/context/auth.context';
import {
  ConversationInfoEntity,
  MessageEntity,
  SendNewMessageSocketData,
  SendReactionSocketData,
} from '../../../../domain/entity/conversation.entity';
import { useConversationDispatch } from '../redux/conversation.store';
import { updateNewConversation } from '../redux/conversation.slice';
import { SocketNamespaces } from '../../../../common/constant/socket.constant';
import { useSocketContext } from '../../../../common/context/socket.context';
import HeadConversationComponent from './HeadConversationComponent';
import { formatDateWithWeekday } from '../../../../common/util/date.util';
import { useClickOutside } from '../../../../common/hook/useClickOutside';
import TextingComponent from '../../../components/TextingComponent';
import EmojiReactionComponent from '../../../components/EmojiReactionComponent';

function ConversationChat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationDispatch = useConversationDispatch();
  const conversationId = searchParams.get('id');
  const friendId =
    searchParams.get('friend') ?? Number(searchParams.get('friend'));
  const { userId } = useAuthContext();
  const scrollLastRef = useRef<HTMLDivElement>(null);
  const conversationScrollRef = useRef<HTMLDivElement>(null);
  const firstVisibleMessageRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [openReactMsgId, setOpenReactMsgId] = useState('');
  const [msgHoverId, setMsgHoverId] = useState('');
  const [conversationMessageList, setConversationMessageList] = useState<
    MessageEntity[]
  >([]);

  const [dateTimeSend, setDateTimeSendPosition] = useState({
    top: 0,
    right: 0,
  });
  const [conversationEntity, setConversationEntity] =
    useState<ConversationInfoEntity>();

  const [pageEntity, setPageEntity] = useState<PageEntity>({
    pageSize: 20,
    currentPage: 1,
  });

  const messageApi = useCallApi();
  const conversationApi = useCallApi();

  const { socket } = useSocketContext();
  const conversationSocket = socket(SocketNamespaces.conversation);

  useClickOutside(emojiPickerRef, () => setOpenReactMsgId(''));

  const handleLoadingMoreMessage = async () => {
    const scrollContainer = conversationScrollRef.current;

    if (checkIsAtBottom(conversationScrollRef)) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }

    if (scrollContainer && scrollContainer.scrollTop === 0) {
      const nextPage = pageEntity.currentPage + 1;
      if (nextPage < pageEntity.totalPage!) {
        await messageApi.callApi(async () => {
          const previousScrollHeight = scrollContainer.scrollHeight || 0;
          const data = await getMessagePage(
            nextPage,
            pageEntity.pageSize,
            conversationId!,
          );

          setConversationMessageList((prev) => [...data.messageList, ...prev]);
          setPageEntity((prev) => ({
            ...prev,
            currentPage: nextPage,
            totalPage: data.totalPage,
          }));
          if (scrollContainer) {
            setTimeout(() => {
              const newScrollHeight = scrollContainer.scrollHeight;
              const scrollOffset = newScrollHeight - previousScrollHeight - 40;
              scrollContainer.scrollTo({
                top: scrollContainer.scrollTop + scrollOffset,
                behavior: 'smooth',
              });
            }, 0);
          }
        });
      }
    }
  };
  const handleSendReaction = async (emoji: string, msgId: string) => {
    setOpenReactMsgId('');
    const data = await reactMessage(userId!, emoji, msgId);
    const newMsgList = updateReactionMessage(conversationMessageList, {
      messageId: msgId,
      reactionList: data.reactionList,
      reactedCount: data.reactedCount,
    });

    setConversationMessageList([...newMsgList]);
  };
  useEffect(() => {
    if (conversationId) {
      messageApi.callApi(async () => {
        const data = await getMessagePage(
          pageEntity.currentPage,
          pageEntity.pageSize,
          conversationId!,
        );

        setConversationMessageList(data.messageList);
        setPageEntity((prev) => ({
          ...prev,
          currentPage: 1,
          totalPage: data.totalPage,
        }));
      });
      conversationApi.callApi(async () => {
        const data = await getConversation(conversationId, userId!);
        setConversationEntity(data);
      });
    } else if (Number(friendId)) {
      conversationApi.callApi(async () => {
        const converId = await getConversationId(Number(friendId), userId!);

        if (converId) {
          setSearchParams({ id: converId });
        } else {
        }
      });
    }
  }, [conversationId, friendId]);

  useEffect(() => {
    const receiveMessageHandler = async (data: SendNewMessageSocketData) => {
      conversationDispatch(
        updateNewConversation({
          conversationId: data.conversationId,
          senderId: data.senderId,
          createdAt: data.createdAt,
          content: data.content,
        }),
      );

      if (conversationId) {
        const newMsgList = handleNewMessageInComing(
          data,
          conversationMessageList,
          conversationId,
          userId!,
        );
        setConversationMessageList([...newMsgList]);
      }
    };
    const receiveReactionHandler = async (data: SendReactionSocketData) => {
      const newMsgList = updateReactionMessage(conversationMessageList, data);
      setConversationMessageList([...newMsgList]);
    };

    conversationSocket.on('receive-message', receiveMessageHandler);
    conversationSocket.on('receive-reaction', receiveReactionHandler);

    return () => {
      conversationSocket.off('receive-message', receiveMessageHandler);
      conversationSocket.off('receive-reaction', receiveReactionHandler);
    };
  }, [conversationMessageList]);

  useEffect(() => {
    if (
      scrollLastRef.current &&
      isFirstTime &&
      conversationMessageList.length > 0
    ) {
      scrollLastRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsFirstTime(false);
    } else if (scrollLastRef.current && isAtBottom) {
      scrollLastRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessageList]);

  useEffect(() => {
    const element = conversationScrollRef.current;
    if (element) {
      element.addEventListener('scroll', handleLoadingMoreMessage);
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', handleLoadingMoreMessage);
      }
    };
  }, [pageEntity]);

  return (
    <div className="flex size-full flex-col rounded-[0.8rem] bg-white px-4 py-2 shadow-md">
      <HeadConversationComponent
        imageUrl={conversationEntity?.imageUrl}
        name={conversationEntity?.name}
        friendId={
          conversationEntity?.memberList.find((u) => u.id !== userId)?.id
        }
      />
      <hr className="my-2" />

      <section
        className="flex grow flex-col overflow-y-scroll"
        ref={conversationScrollRef}
      >
        {conversationMessageList.map((message, index) => {
          const imSender = message.senderId === userId;

          const messageChain = message.messageChain;
          const lastIndex = messageChain.length - 1;
          const haveOne = messageChain.length === 1 ? true : false;
          return (
            <div
              key={index}
              className="my-2"
              ref={index === 0 ? firstVisibleMessageRef : null}
            >
              <div className="text-center text-8 text-gray-400">
                {formatDateWithWeekday(
                  new Date(message.messageChain[0].createdAt),
                )}
              </div>
              {!imSender
                ? messageChain.map((msg, msgIndex) => {
                    return (
                      <div className="flex" key={msg.id}>
                        <span className="flex grow basis-1/2 flex-col">
                          <div className="flex items-center gap-2 text-wrap break-words">
                            <img
                              src={
                                conversationEntity?.memberList.find(
                                  (member) => member.id === message.senderId,
                                )?.avatarUrl
                              }
                              alt=""
                              className={`${haveOne || msgIndex === lastIndex ? 'visible' : 'invisible'} h-[1.8rem] w-[1.8rem] rounded-full object-cover`}
                            />

                            <div className="relative w-fit max-w-[28rem] text-wrap break-words">
                              <div
                                className={`${haveOne ? 'rounded-l-[0.8rem]' : msgIndex === 0 ? 'rounded-tl-[0.8rem]' : msgIndex === lastIndex ? 'rounded-bl-[0.8rem]' : ''} peer relative w-fit max-w-[28rem] hyphens-manual whitespace-pre-wrap text-wrap break-words rounded-r-[0.8rem] border-[1px] px-2 py-1 shadow-[0_0_2px_0px_rgba(0,0,0,0.3)]`}
                                onMouseEnter={(e) => {
                                  const target =
                                    e.target as HTMLParagraphElement;
                                  const rect = target.getBoundingClientRect();

                                  setDateTimeSendPosition({
                                    top: rect.bottom,
                                    right: window.innerWidth - rect.left,
                                  });
                                  setMsgHoverId(msg.id!);
                                }}
                                onMouseLeave={() => {
                                  setMsgHoverId('');
                                }}
                              >
                                <p>{msg.content}</p>
                                {(msgHoverId === msg.id ||
                                  openReactMsgId !== '') && (
                                  <div className="absolute bottom-0 left-[100%] box-content flex aspect-[1/1] size-[2rem] cursor-pointer items-center justify-end pl-1">
                                    {(openReactMsgId === msg.id ||
                                      msgHoverId === msg.id) && (
                                      <img
                                        src={REACT_EMOJI_ICON}
                                        alt=""
                                        className="h-[2rem] w-[2rem] p-2"
                                        onClick={() =>
                                          setOpenReactMsgId(msg.id!)
                                        }
                                      />
                                    )}
                                    <div
                                      className="absolute bottom-[120%] left-0 translate-x-[-10%]"
                                      ref={
                                        openReactMsgId === msg.id
                                          ? emojiPickerRef
                                          : null
                                      }
                                    >
                                      {openReactMsgId === msg.id && (
                                        <EmojiReactionComponent
                                          onClickEmoji={async (emoji) => {
                                            await handleSendReaction(
                                              emoji,
                                              msg.id!,
                                            );
                                            setOpenReactMsgId('');
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {msg.reactedCount > 0 && (
                                <div className="absolute left-[calc(100%-1rem)] top-[90%] cursor-pointer">
                                  <span className="bg-white-500 flex rounded-xl border-[1px] bg-white px-1">
                                    {msg.reactionList.map(
                                      (emoji, emojiIndex) => (
                                        <p
                                          key={emojiIndex}
                                          className="align-middle text-9"
                                        >
                                          {emoji}
                                        </p>
                                      ),
                                    )}
                                    {
                                      <p className="text-9">
                                        {msg.reactedCount}
                                      </p>
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                            {msgHoverId === msg.id && (
                              <p
                                className="absolute right-[90%] top-[100%] z-50 min-w-[20rem] rounded-xl bg-gray-200 px-2 py-1 text-center text-gray-500 peer-hover:visible"
                                style={{
                                  top: `${dateTimeSend.top - 40}px`,
                                  right: `${dateTimeSend.right}px`,
                                }}
                              >
                                {formatDateWithWeekday(new Date(msg.createdAt))}
                              </p>
                            )}
                          </div>
                          {msg.reactedCount > 0 && (
                            <div className="h-[1.2rem]"></div>
                          )}
                        </span>
                        <div className="grow basis-1/2"></div>
                      </div>
                    );
                  })
                : messageChain.map((msg, msgIndex) => {
                    return (
                      <div className="flex" key={msg.id}>
                        <div className="grow basis-1/2"></div>
                        <span className="flex grow basis-1/2 flex-col">
                          <div className="flex flex-row-reverse items-center gap-2 text-wrap break-words">
                            {/* <img
                              src={
                                conversationEntity?.memberList.find(
                                  (member) => member.id === message.senderId,
                                )?.avatarUrl
                              }
                              alt=""
                              className={`${haveOne || index === lastIndex ? 'visible' : 'invisible'} h-[1.8rem] w-[1.8rem] rounded-full object-cover`}
                            /> */}

                            <div className="relative w-fit max-w-[28rem] text-wrap break-words">
                              <div
                                className={`${haveOne ? 'rounded-r-[0.8rem]' : msgIndex === 0 ? 'rounded-tr-[0.8rem]' : msgIndex === lastIndex ? 'rounded-br-[0.8rem]' : ''} peer relative w-fit max-w-[28rem] hyphens-manual whitespace-pre-wrap text-wrap break-words rounded-l-[0.8rem] border-[1px] bg-cyan-200 px-2 py-1 shadow-[0_0_2px_0px_rgba(0,0,0,0.3)]`}
                                onMouseEnter={(e) => {
                                  const target =
                                    e.target as HTMLParagraphElement;
                                  const rect = target.getBoundingClientRect();

                                  setDateTimeSendPosition({
                                    top: rect.top,
                                    right: window.innerWidth - rect.left + 30,
                                  });
                                  setMsgHoverId(msg.id!);
                                }}
                                onMouseLeave={() => {
                                  setMsgHoverId('');
                                }}
                              >
                                <p>{msg.content}</p>
                                {(msgHoverId === msg.id ||
                                  openReactMsgId !== '') && (
                                  <div className="absolute bottom-0 right-[100%] box-content flex aspect-[1/1] size-[2rem] cursor-pointer items-center justify-end pl-1">
                                    {(openReactMsgId === msg.id ||
                                      msgHoverId === msg.id) && (
                                      <img
                                        src={REACT_EMOJI_ICON}
                                        alt=""
                                        className="h-[2rem] w-[2rem] p-2"
                                        onClick={() =>
                                          setOpenReactMsgId(msg.id!)
                                        }
                                      />
                                    )}
                                    <div
                                      className="absolute bottom-[120%] right-[100%]"
                                      ref={
                                        openReactMsgId === msg.id
                                          ? emojiPickerRef
                                          : null
                                      }
                                    >
                                      {openReactMsgId === msg.id && (
                                        <EmojiReactionComponent
                                          onClickEmoji={async (emoji) => {
                                            setOpenReactMsgId('');
                                            await handleSendReaction(
                                              emoji,
                                              msg.id!,
                                            );
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {msg.reactedCount > 0 && (
                                <div className="absolute right-[calc(100%-1rem)] top-[90%] cursor-pointer">
                                  <span className="bg-white-500 flex rounded-xl border-[1px] bg-white px-1">
                                    {msg.reactionList.map(
                                      (emoji, emojiIndex) => (
                                        <p
                                          key={emojiIndex}
                                          className="align-middle text-9"
                                        >
                                          {emoji}
                                        </p>
                                      ),
                                    )}
                                    {
                                      <p className="text-9">
                                        {msg.reactedCount}
                                      </p>
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                            {msgHoverId === msg.id && (
                              <p
                                className="absolute z-50 min-w-[20rem] rounded-xl bg-gray-200 px-2 py-1 text-center text-gray-500"
                                style={{
                                  top: `${dateTimeSend.top - 8}px`,
                                  right: `${dateTimeSend.right}px`,
                                }}
                              >
                                {formatDateWithWeekday(new Date(msg.createdAt))}
                              </p>
                            )}
                          </div>
                          {msg.reactedCount > 0 && (
                            <div className="h-[1.2rem]"></div>
                          )}
                        </span>
                      </div>
                    );
                  })}
            </div>
          );
        })}
        <div ref={scrollLastRef}></div>
      </section>
      <TextingComponent
        conversationId={conversationId}
        onAfterSend={function (data: any): void {
          if (conversationId) {
            const lastMessage =
              conversationMessageList[conversationMessageList.length - 1];
            if (lastMessage?.senderId === userId!) {
              lastMessage.messageChain.push(data);
            } else {
              conversationMessageList.push({
                messageChain: [data],
                senderId: userId!,
              });
            }
            setConversationMessageList([...conversationMessageList]);
          } else {
          }
        }}
        receiverId={Number(friendId)}
      />
    </div>
  );
}

export default ConversationChat;
