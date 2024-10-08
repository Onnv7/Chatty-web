import PHONE_CALL_ICON from '@icon/phone_calling_icon.svg';
import VIDEO_CALL_ICON from '@icon/video_call_icon.svg';
import {
  useConversationSelector,
  conversationSelector,
} from '../redux/conversation.store';
import Peer from 'peerjs';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../../../common/context/auth.context';
import {
  getMessagePage,
  getConversation,
  getConversationId,
  getFriendProfileSummary,
} from '../../../../domain/usecase/conversation.usecase';
import { useCallApi } from '../../../../common/hook/useCallApi';
import {
  ConversationInfoEntity,
  ConversationSummaryEntity,
} from '../../../../domain/entity/conversation.entity';
type HeadConversationComponentProps = {
  imageUrl?: string;
  name?: string;
};
function HeadConversationComponent({
  imageUrl,
  name,
}: HeadConversationComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationId = searchParams.get('id');
  const friendId =
    searchParams.get('friend') ?? Number(searchParams.get('friend'));
  const { userId } = useAuthContext();
  const conversationPayload = useConversationSelector(conversationSelector);
  const conversationApi = useCallApi();
  const [conversationInfo, setConversationInfo] = useState<
    ConversationSummaryEntity | undefined
  >({
    imageUrl: imageUrl ?? '',
    name: name ?? '',
  });

  useEffect(() => {
    if (conversationId) {
      conversationApi.callApi(async () => {
        const data = await getConversation(conversationId);
        const friend = data.memberList.find((data) => data.id !== userId);
        setConversationInfo({
          imageUrl: friend?.avatarUrl!,
          name: friend?.name!,
        });
      });
    } else if (Number(friendId)) {
      conversationApi.callApi(async () => {
        const converId = await getConversationId(Number(friendId), userId!);
        if (converId) setSearchParams({ id: converId });
        else {
          const { fullName, avatarUrl } = await getFriendProfileSummary(
            Number(friendId),
          );
          setConversationInfo({ name: fullName, imageUrl: avatarUrl });
        }
      });
    }
  }, [conversationId, friendId]);
  return (
    <section className="flex items-center gap-4">
      <img
        src={conversationInfo?.imageUrl}
        alt=""
        className="size-[3.4rem] rounded-full object-cover"
      />
      <div className="grow">
        <h3 className="text-14 font-5">{conversationInfo?.name}</h3>
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
  );
}

export default HeadConversationComponent;
