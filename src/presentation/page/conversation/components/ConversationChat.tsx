import PHONE_CALL_ICON from '@icon/phone_calling_icon.svg';
import VIDEO_CALL_ICON from '@icon/video_call_icon.svg';
import SEND_ICON from '@icon/send_message_icon.svg';
import EMOJI_ICON from '@icon/emoji_icon.svg';
import MEDIA_ICON from '@icon/media_icon.svg';
import LOCATION_ICON from '@icon/location_icon.svg';
import CLOSE_ICON from '@icon/X_ICON.svg';
import { conversationMessageList } from '../../../../common/data/example.data';
import { useEffect, useRef, useState } from 'react';
import EmojiPicker, { Emoji, EmojiClickData } from 'emoji-picker-react';
import { useControlPanel } from '../../../../common/hook/useControlPanel';
import { useSearchParams } from 'react-router-dom';
import { useCallApi } from '../../../../common/hook/useCallApi';
import {
  getMessagePage,
  handleChangeIcon,
  handleChangeMedia,
  handleChangeMessage,
  handleSendMessage,
} from '../../../../domain/usecase/conversation.usecase';
import { PageEntity } from '../../../../domain/entity/common.entity';
import { useAuthContext } from '../../../../common/context/auth.context';
import {
  MessageEntity,
  UpdateNewMessageEntity,
} from '../../../../domain/entity/conversation.entity';
import {
  conversationSelector,
  useConversationDispatch,
  useConversationSelector,
} from '../redux/conversation.store';
import { updateNewConversation } from '../redux/conversation.slice';

function ConversationChat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationPayload = useConversationSelector(conversationSelector);
  const conversationDispatch = useConversationDispatch();
  const conversationId = searchParams.get('id') || '';
  const { userId } = useAuthContext();
  const [textMessage, setTextMessage] = useState('');
  const conversationScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const [mediaSelected, setMediaSelected] = useState<string[]>([]);
  const [conversationMessageList, setConversationMessageList] = useState<
    MessageEntity[]
  >([]);
  const [pageEntity, setPageEntity] = useState<PageEntity>({
    pageSize: 3,
    currentPage: 1,
  });
  const messageApi = useCallApi();

  const { isVisible, elementRef, panelRef, handleOpen } = useControlPanel({
    hiddenWhenClickPanel: false,
  });
  async function handleSendMessageClick() {
    if (textMessage.trim().length === 0) {
      return;
    }
    const msgList = await handleSendMessage(
      textMessage,
      userId!,
      conversationMessageList,
      undefined,
      conversationId,
    );
    setTextMessage('');
    setConversationMessageList([...msgList]);
    conversationDispatch(
      updateNewConversation({
        conversationId: conversationId,
        senderId: userId!,
        createdAt: new Date().toISOString(),
        content: textMessage,
      }),
    );
  }

  useEffect(() => {
    messageApi.callApi(async () => {
      const data = await getMessagePage(
        pageEntity.currentPage,
        pageEntity.pageSize,
        conversationId!,
      );
      setConversationMessageList(data.messageList);
    });
  }, [conversationId]);

  useEffect(() => {
    if (conversationScrollRef.current) {
      conversationScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessageList]);

  const handleSelectMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = handleChangeMedia(event);
    if (imageUrl) {
      setMediaSelected(imageUrl);
    }
  };

  return (
    <div className="relative flex size-full flex-col rounded-[0.8rem] bg-white px-4 py-2 shadow-md">
      <section className="flex items-center gap-4">
        <img
          src={conversationPayload.conversationSelected?.imageUrl}
          alt=""
          className="size-[3.4rem] rounded-full object-cover"
        />
        <div className="grow">
          <h3 className="text-14 font-5">
            {conversationPayload.conversationSelected?.roomName}
          </h3>
        </div>
        <div className="flex gap-4">
          <img
            src={VIDEO_CALL_ICON}
            alt=""
            className="size-[1.6rem] cursor-pointer"
          />
          <img
            src={PHONE_CALL_ICON}
            alt=""
            className="size-[1.6rem] cursor-pointer"
          />
        </div>
      </section>
      <hr className="my-2" />
      <section className="grow overflow-y-scroll">
        {conversationMessageList.map((message, index) => {
          const imSender = message.senderId === userId;

          const messageChain = message.messageChain;
          const lastIndex = messageChain.length - 1;
          const haveOne = messageChain.length === 1 ? true : false;
          return (
            <div key={index} className="my-2">
              {!imSender
                ? messageChain.map((msg, index) => {
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <img
                          src={message.avatarUrl}
                          alt=""
                          className={`${haveOne || index === lastIndex ? 'visible' : 'invisible'} size-[1.8rem] rounded-full object-cover`}
                        />
                        <p
                          className={`${haveOne ? 'rounded-l-[0.8rem]' : index === 0 ? 'rounded-tl-[0.8rem]' : index === lastIndex ? 'rounded-bl-[0.8rem]' : ''} rounded-r-[0.8rem] border-[1px] px-2 py-1 shadow-[0_0_2px_0px_rgba(0,0,0,0.3)]`}
                        >
                          {msg.content}
                        </p>
                      </div>
                    );
                  })
                : messageChain.map((msg, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-row-reverse items-center gap-2"
                      >
                        <img
                          src={message.avatarUrl}
                          alt=""
                          className={`${haveOne || index === lastIndex ? 'visible' : 'invisible'} size-[1.8rem] rounded-full object-cover`}
                        />
                        <p
                          className={`${haveOne ? 'rounded-r-[0.8rem]' : index === 0 ? 'rounded-tr-[0.8rem]' : index === lastIndex ? 'rounded-br-[0.8rem]' : ''} rounded-l-[0.8rem] border-[1px] bg-primary-4 px-2 py-1 shadow-[0_0_2px_0px_rgba(0,0,0,0.3)]`}
                        >
                          {msg.content}
                        </p>
                      </div>
                    );
                  })}
            </div>
          );
        })}
        <div ref={conversationScrollRef}></div>
      </section>
      <section className="flex w-full items-center">
        <div className="flex grow flex-col rounded-[0.8rem] bg-[#f1ecec]">
          {mediaSelected.length > 0 && (
            <div className="flex gap-6 p-4">
              {mediaSelected.map((image, index) => (
                <span className="relative">
                  <img
                    key={index}
                    src={image}
                    alt={`preview-${index}`}
                    className="size-[4rem] rounded-lg object-cover"
                  />
                  <img
                    src={CLOSE_ICON}
                    alt=""
                    className="absolute right-[-9px] top-[-4px] size-[1.2rem] cursor-pointer rounded-full border-[1px] border-gray-400 bg-white p-[2px]"
                    onClick={() => {
                      const newImages = mediaSelected.filter(
                        (media, i) => i !== index,
                      );
                      setMediaSelected(newImages);
                    }}
                  />
                </span>
              ))}
            </div>
          )}
          <div className="flex w-full grow items-end gap-2 p-2">
            <textarea
              ref={textInputRef}
              placeholder="Type a message..."
              className="grow resize-none overflow-y-auto bg-transparent outline-none"
              value={textMessage}
              onChange={(e) => {
                setTextMessage(e.target.value);
                handleChangeMessage(e);
              }}
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  await handleSendMessageClick();
                }
              }}
              rows={1}
              style={{ maxHeight: '168px' }}
            />
            <div className="flex h-full items-end gap-2">
              <div>
                <img
                  src={MEDIA_ICON}
                  alt=""
                  className="size-[1.6rem] cursor-pointer"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleSelectMedia}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="relative">
                <img
                  ref={elementRef}
                  src={EMOJI_ICON}
                  alt=""
                  className="size-[1.6rem] cursor-pointer"
                  onClick={() => handleOpen()}
                />
                {isVisible && (
                  <div
                    className="absolute bottom-[100%] right-0"
                    ref={panelRef}
                  >
                    <EmojiPicker
                      height={500}
                      width={400}
                      onEmojiClick={(emoji, e) => {
                        setTextMessage((prev) => prev + emoji.emoji);
                        handleChangeIcon(textInputRef);
                      }}
                    />
                  </div>
                )}
              </div>
              <img
                src={LOCATION_ICON}
                alt=""
                className="size-[1.6rem] cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="flex h-full items-end">
          <img
            src={SEND_ICON}
            alt=""
            className="my-2 size-[1.6rem] cursor-pointer"
            onClick={async () => {
              await handleSendMessageClick();
            }}
          />
        </div>
      </section>
    </div>
  );
}

export default ConversationChat;
