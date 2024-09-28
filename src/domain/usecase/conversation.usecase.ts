import { RefObject } from 'react';
import {
  conversationRepository,
  messageRepository,
} from '../../data/repository';
import { PageEntity } from '../entity/common.entity';
import { MessageEntity } from '../entity/conversation.entity';

export async function getConversationPage(
  page: number,
  size: number,
  userId: number,
) {
  const { totalPage, conversationList } =
    await conversationRepository.getConversationPage(page, size, userId!);
  return { totalPage, conversationList };
}

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

export async function handleSendMessage(
  content: string,
  userId: number,
  conversationMessageList: MessageEntity[],
  receiverId?: number,
  conversationId?: string,
) {
  if (conversationId)
    await messageRepository.sendMessage(content, userId, conversationId);
  else {
    await messageRepository.sendMessage(content, userId, undefined, [
      userId,
      receiverId!,
    ]);
  }
  const lastMessage =
    conversationMessageList[conversationMessageList.length - 1];
  if (lastMessage.senderId === userId!) {
    lastMessage.messageChain.push({
      content: content,
      createdAt: new Date(),
    });
  } else {
    conversationMessageList.push({
      messageChain: [
        {
          content: content,
          createdAt: new Date(),
        },
      ],
      senderId: userId!,
      avatarUrl:
        'https://editorial.uefa.com/resources/027c-16d30c80a3e5-8717973e3fb0-1000/portugal_v_france_-_uefa_euro_2020_group_f.jpeg',
    });
  }

  return conversationMessageList;
}
