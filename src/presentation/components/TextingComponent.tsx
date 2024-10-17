import SEND_ICON from '@icon/send_message_icon.svg';
import EMOJI_ICON from '@icon/emoji_icon.svg';
import MEDIA_ICON from '@icon/media_icon.svg';
import LOCATION_ICON from '@icon/location_icon.svg';
import CLOSE_ICON from '@icon/X_ICON.svg';
import REACT_EMOJI_ICON from '@icon/react_emoji_icon.svg';

import EmojiPicker from 'emoji-picker-react';

import {
  handleChangeMessage,
  handleChangeIcon,
  handleChangeMedia,
  handleSendMessageToRoom,
  handleSendMessageToFriend,
} from '../../domain/usecase/conversation.usecase';
import { useRef, useState } from 'react';
import { useControlPanel } from '../../common/hook/useControlPanel';
import { useAuthContext } from '../../common/context/auth.context';
import {
  conversationSelector,
  useConversationDispatch,
  useConversationSelector,
} from '../page/conversation/redux/conversation.store';
import { conversationMessageList } from '../../common/data/example.data';
import {
  refreshCallConversationList,
  updateNewConversation,
} from '../page/conversation/redux/conversation.slice';
import { useNavigate } from 'react-router-dom';
import { AppRouter } from '../../common/config/router.config';
type TextingComponentProps = {
  conversationId: string | null;
  receiverId: number | null;
  onAfterSend: (data: any) => void;
};

function TextingComponent({
  conversationId,
  receiverId,
  onAfterSend,
}: TextingComponentProps) {
  //   const conversationPayload = useConversationSelector(conversationSelector);
  const conversationDispatch = useConversationDispatch();
  const { userId } = useAuthContext();
  const navigate = useNavigate();
  const [textMessage, setTextMessage] = useState('');
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaSelected, setMediaSelected] = useState<string[]>([]);
  const { isVisible, elementRef, panelRef, handleOpen } = useControlPanel({
    hiddenWhenClickPanel: false,
  });

  const handleSelectMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = handleChangeMedia(event);
    if (imageUrl) {
      setMediaSelected(imageUrl);
    }
  };
  async function handleSendMessageClick() {
    if (textMessage.trim().length === 0) {
      return;
    }
    if (conversationId) {
      const msgSend = await handleSendMessageToRoom(
        textMessage,
        userId!,
        conversationId,
      );
      setTextMessage('');
      if (conversationId) {
        conversationDispatch(
          updateNewConversation({
            conversationId: conversationId,
            senderId: userId!,
            createdAt: new Date().toISOString(),
            content: textMessage,
          }),
        );
      }
      if (onAfterSend) {
        onAfterSend(msgSend);
      }
    } else {
      const conversationId = await handleSendMessageToFriend(
        textMessage,
        userId!,
        receiverId!,
      );
      setTextMessage('');
      navigate(`${AppRouter.conversation.route}?id=${conversationId}`);

      conversationDispatch(refreshCallConversationList(true));
    }
  }
  return (
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
                if (textInputRef.current)
                  textInputRef.current.style.height = 'auto';
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
                <div className="absolute bottom-[100%] right-0" ref={panelRef}>
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
            if (textInputRef.current)
              textInputRef.current.style.height = 'auto';
          }}
        />
      </div>
    </section>
  );
}

export default TextingComponent;
