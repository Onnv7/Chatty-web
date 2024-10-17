import MORE_ICON from '@icon/more_icon.svg';
import EmojiPicker from 'emoji-picker-react';

const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

type EmojiReactionComponentProps = {
  selectedEmoji?: string;
  className?: string;
  onClickEmoji?: (emoji: string) => Promise<void>;
};

function EmojiReactionComponent({
  className = '',
  selectedEmoji = '',
  onClickEmoji,
}: EmojiReactionComponentProps) {
  return (
    <div className={`h-fit w-full ${className} bg-white`}>
      {/* <EmojiPicker className="fixed left-0 top-[0]" /> */}
      <div className="flex w-fit rounded-[2rem] border-[1px] border-gray-300 py-1">
        {emojis.map((emoji) => (
          <div
            key={emoji}
            onClick={async () => {
              if (onClickEmoji) await onClickEmoji(emoji);
            }}
            className={`mx-1 cursor-pointer border-none bg-none text-2xl transition-all hover:scale-[1.2] ${selectedEmoji === emoji ? 'scale-[1.2] rounded-xl bg-gray-400 bg-opacity-50' : ''}`}
          >
            {emoji}
          </div>
        ))}
        <div className="mx-1 size-[2rem] cursor-pointer border-none leading-[2rem] transition-all hover:scale-[1.2]">
          <img
            src={MORE_ICON}
            alt=""
            className={`border-none transition-all`}
          />
        </div>
      </div>
    </div>
  );
}

export default EmojiReactionComponent;
