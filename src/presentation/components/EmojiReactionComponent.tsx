import React, { useState } from 'react';

const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

type EmojiReactionComponentProps = {
  selectedEmoji?: string;
  onClickEmoji?: (emoji: string) => void;
};

function EmojiReactionComponent({
  selectedEmoji = '',
  onClickEmoji,
}: EmojiReactionComponentProps) {
  return (
    <div className="block h-[5rem]">
      <div className="inline-block rounded-[2rem] border-[1px] border-gray-300 py-1">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              if (onClickEmoji) onClickEmoji(emoji);
            }}
            className={`mx-1 cursor-pointer border-none bg-none text-2xl transition-all hover:scale-[1.2] ${selectedEmoji === emoji ? 'scale-[1.2] rounded-xl bg-gray-400 bg-opacity-50' : ''}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmojiReactionComponent;
