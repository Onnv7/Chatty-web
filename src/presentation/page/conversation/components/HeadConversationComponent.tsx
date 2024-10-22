import PHONE_CALL_ICON from '@icon/phone_calling_icon.svg';
import VIDEO_CALL_ICON from '@icon/video_call_icon.svg';
import {
  useConversationSelector,
  conversationSelector,
} from '../redux/conversation.store';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../../../common/context/auth.context';
import {
  getConversation,
  getConversationId,
  getFriendProfileSummary,
  openCallingWindow,
} from '../../../../domain/usecase/conversation.usecase';
import { useCallApi } from '../../../../common/hook/useCallApi';
import { ConversationSummaryEntity } from '../../../../domain/entity/conversation.entity';
import { usePeerContext } from '../../../../common/context/peer.context';
import { useSocketContext } from '../../../../common/context/socket.context';
import { CallRole } from '../../../../common/constant/enum';
type HeadConversationComponentProps = {
  imageUrl?: string;
  name?: string;
  friendId?: number;
};
function HeadConversationComponent({
  imageUrl,
  name,
}: HeadConversationComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationId = searchParams.get('id');
  const friendIdParam =
    searchParams.get('friend') ?? Number(searchParams.get('friend'));
  const { userId } = useAuthContext();
  const { handleCall } = usePeerContext();
  const conversationApi = useCallApi();
  const [conversationInfo, setConversationInfo] = useState<
    ConversationSummaryEntity | undefined
  >({
    imageUrl: imageUrl ?? '',
    name: name ?? '',
  });
  async function handleCalling() {
    handleCall(conversationId!);
  }

  async function handleVideoCall() {
    if (conversationId) openCallingWindow(conversationId, CallRole.CALLER);
  }

  useEffect(() => {
    if (conversationId) {
      conversationApi.callApi(async () => {
        const data = await getConversation(conversationId, userId!);
        const friend = data.memberList.find((data) => data.id !== userId);
        setConversationInfo({
          imageUrl: friend?.avatarUrl!,
          name: friend?.name!,
        });
      });
    } else if (Number(friendIdParam)) {
      conversationApi.callApi(async () => {
        const converId = await getConversationId(
          Number(friendIdParam),
          userId!,
        );
        if (converId) setSearchParams({ id: converId });
        else {
          const { fullName, avatarUrl } = await getFriendProfileSummary(
            Number(friendIdParam),
          );
          setConversationInfo({ name: fullName, imageUrl: avatarUrl });
        }
      });
    }
  }, [conversationId, friendIdParam]);
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
          onClick={() => handleVideoCall()}
        />
        <img
          src={PHONE_CALL_ICON}
          alt=""
          className="size-[1.6rem] cursor-pointer"
          onClick={() => handleCalling()}
        />
      </div>
    </section>
  );
}

export default HeadConversationComponent;
