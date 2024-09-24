import PHONE_CALL_ICON from '@icon/phone_calling_icon.svg';
import VIDEO_CALL_ICON from '@icon/video_call_icon.svg';
import SEND_ICON from '@icon/send_message_icon.svg';
import EMOJI_ICON from '@icon/emoji_icon.svg';
import MEDIA_ICON from '@icon/media_icon.svg';
import LOCATION_ICON from '@icon/location_icon.svg';
import CLOSE_ICON from '@icon/X_ICON.svg';
import { conversationMessageList } from '../../../../common/data/example.data';
import { useRef, useState } from 'react';
import EmojiPicker, { Emoji, EmojiClickData } from 'emoji-picker-react';
import { useControlPanel } from '../../../../common/hook/useControlPanel';

const userId = 1;

function ConversationChat() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textMessage, setTextMessage] = useState('');
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const [mediaSelected, setMediaSelected] = useState<string[]>([]);

  const [openEmoji, setOpenEmoji] = useState(false);
  const { isVisible, elementRef, panelRef, handleOpen } = useControlPanel({
    hiddenWhenClickPanel: false,
  });
  const handleChangeMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const imageUrls: string[] = [];

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            imageUrls.push(e.target.result as string);
            if (imageUrls.length === fileArray.length) {
              setMediaSelected(imageUrls);
            }
          }
        };
        reader.readAsDataURL(file); // Đọc file dưới dạng URL
      });
    }
  };
  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 6 * 24)}px`;
  };
  const handleChangeIcon = (emoji: EmojiClickData, e: MouseEvent) => {
    setTextMessage((prev) => prev + emoji.emoji);

    if (textInputRef.current) {
      textInputRef.current.style.height = 'auto';
      textInputRef.current.style.height = `${Math.min(textInputRef.current.scrollHeight, 6 * 24)}px`;
    }
  };
  const handleOpenMedia = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Mở hộp thoại chọn file
    }
  };

  return (
    <div className="relative flex size-full flex-col rounded-[0.8rem] bg-white px-4 py-2 shadow-md">
      <section className="flex items-center gap-4">
        <img
          src={
            'https://editorial.uefa.com/resources/027c-16d30c80a3e5-8717973e3fb0-1000/portugal_v_france_-_uefa_euro_2020_group_f.jpeg'
          }
          alt=""
          className="size-[3.4rem] rounded-full object-cover"
        />
        <div className="grow">
          <h3 className="text-14 font-5">Ronaldo</h3>
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
        {conversationMessageList.map((message) => {
          const imSender = message.senderId === userId;
          const messageChain = message.messageChain;
          const lastIndex = messageChain.length - 1;
          const haveOne = messageChain.length === 1 ? true : false;
          return (
            <div className="my-2">
              {imSender
                ? messageChain.map((msg, index) => {
                    return (
                      <div className="flex gap-2">
                        <img
                          src={message.imageUrl}
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
                      <div className="flex flex-row-reverse gap-2">
                        <img
                          src={message.imageUrl}
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
              onChange={handleChangeMessage}
              rows={1}
              style={{ maxHeight: '168px' }}
            />
            <div className="flex h-full items-end gap-2">
              <div>
                <img
                  src={MEDIA_ICON}
                  alt=""
                  className="size-[1.6rem] cursor-pointer"
                  onClick={handleOpenMedia}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleChangeMedia}
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
                      onEmojiClick={handleChangeIcon}
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
          />
        </div>
      </section>
    </div>
  );
}

export default ConversationChat;
