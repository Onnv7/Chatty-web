import { RefObject } from 'react';
import {
  conversationRepository,
  friendRepository,
  messageRepository,
} from '../../data/repository';
import { PageEntity } from '../entity/common.entity';
import {
  MessageEntity,
  SendNewMessageSocketData,
  SendReactionSocketData,
} from '../entity/conversation.entity';

// export async function getConversationPage(
//   page: number,
//   size: number,
//   userId: number,
// ) {
//   const { totalPage, conversationList } =
//     await conversationRepository.getConversationPage(page, size, userId!);
//   return { totalPage, conversationList };
// }

export async function getMessagePage(
  page: number,
  size: number,
  conversationId: string,
) {
  const { totalPage, messageList } = await messageRepository.getMessagePage(
    page,
    size,
    conversationId,
  );
  return { totalPage, messageList };
}

export function handleChangeMedia(event: React.ChangeEvent<HTMLInputElement>) {
  const files = event.target.files;

  if (files) {
    const fileArray = Array.from(files);
    const imageUrls: string[] = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          imageUrls.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng URL
    });
    return imageUrls;
  }
}
export function handleChangeMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
  e.target.style.height = 'auto';
  e.target.style.height = `${Math.min(e.target.scrollHeight, 6 * 24)}px`;
}

export function handleChangeIcon(textInputRef: RefObject<HTMLTextAreaElement>) {
  if (textInputRef.current) {
    textInputRef.current.style.height = 'auto';
    textInputRef.current.style.height = `${Math.min(textInputRef.current.scrollHeight, 6 * 24)}px`;
  }
}

export async function handleSendMessageToRoom(
  content: string,
  userId: number,
  conversationId: string,
) {
  let msgId = await messageRepository.sendMessage(
    content,
    userId,
    conversationId,
  );

  return {
    content: content,
    createdAt: new Date(),
    id: msgId,
  };
}

export async function handleSendMessageToFriend(
  content: string,
  userId: number,
  receiverId: number,
) {
  return await messageRepository.sendMessage(content, userId, undefined, [
    userId,
    receiverId!,
  ]);
}

export async function getConversation(conversationId: string) {
  const data = await conversationRepository.getConversation(conversationId);
  return data;
}

export function handleNewMessageInComing(
  data: SendNewMessageSocketData,
  conversationMessageList: MessageEntity[],
  conversationId: string,
  userId: number,
) {
  if (conversationId === data.conversationId) {
    const lastMessage =
      conversationMessageList[conversationMessageList.length - 1];
    if (lastMessage.senderId === userId!) {
      conversationMessageList.push({
        messageChain: [
          {
            content: data.content,
            createdAt: new Date(data.createdAt),
            reactedCount: 0,
            reactionList: [],
          },
        ],
        senderId: data.senderId,
      });
    } else {
      lastMessage.messageChain.push({
        content: data.content,
        createdAt: new Date(data.createdAt),
        reactedCount: 0,
        reactionList: [],
      });
    }
  }
  return conversationMessageList;
}

export const checkIsAtBottom = (
  scrollContainerRef: RefObject<HTMLDivElement>,
): boolean => {
  if (!scrollContainerRef.current) return false;
  const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

  return scrollTop + clientHeight >= scrollHeight - 50;
};

export const getConversationId = async (friendId: number, userId: number) => {
  return conversationRepository.getConversationIdByFriendId(friendId, userId);
};

export const getFriendProfileSummary = async (friendId: number) => {
  return friendRepository.getFriendProfileSummary(friendId);
};

export async function reactMessage(
  userId: number,
  reaction: string,
  messageId: string,
) {
  return await messageRepository.reactMessage(userId, reaction, messageId);
}

export function updateReactionMessage(
  conversationMessageList: MessageEntity[],
  data: { messageId: string; reactionList: string[]; reactedCount: number },
) {
  let found = false;
  return conversationMessageList.map((message) => {
    if (found) return message;
    for (let i = 0; i < message.messageChain.length; i++) {
      let msg = message.messageChain[i];
      if (msg.id === data.messageId) {
        msg.reactionList = data.reactionList;
        msg.reactedCount = data.reactedCount;
        found = true;
        break;
      }
    }
    return message;
  });
}
