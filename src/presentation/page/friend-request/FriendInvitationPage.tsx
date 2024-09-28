import React, {
  LegacyRef,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import PendingFriendItemComponent from './components/PendingFriendItemComponent';
import { FriendInvitationEntity } from '../../../domain/entity/friend.entity';
import { useCallApi } from '../../../common/hook/useCallApi';
import { PageEntity } from '../../../domain/entity/common.entity';
import {
  getInvitationList,
  scrollNextPageInvitation,
} from '../../../domain/usecase/friend.usecase';
import { useAuthContext } from '../../../common/context/auth.context';
import { ActorType } from '../../../common/constant/enum';
import SendInvitationComponent from './components/SendInvitationComponent';

import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import useScrollFetchData from '../../../common/hook/useScrollFetchData';

function FriendInvitationPage() {
  const { userId } = useAuthContext();
  const swiperRef = useRef<any>(null);

  const [actorType, setActorType] = useState<ActorType>(ActorType.RECEIVER);
  const pendingScrollRef = useRef<HTMLDivElement>(null);

  const [pendingPageEntity, setPendingPageEntity] = useState<PageEntity>({
    pageSize: 10,
    currentPage: 1,
  });

  const [sendPageEntity, setSendPageEntity] = useState<PageEntity>({
    pageSize: 10,
    currentPage: 1,
  });
  const [pendingInvitationList, setPendingInvitationList] = useState<
    FriendInvitationEntity[]
  >([]);

  const [sendInvitationList, setSendInvitationList] = useState<
    FriendInvitationEntity[]
  >([]);

  const pendingInvitationApi = useCallApi();
  const sendInvitationApi = useCallApi();

  const handleScroll = async () => {
    if (pendingScrollRef.current) {
      const { scrollTop, clientHeight, scrollHeight } =
        pendingScrollRef.current;
      const data = await scrollNextPageInvitation(
        pendingPageEntity,
        userId!,
        scrollTop,
        clientHeight,
        scrollHeight,
        actorType,
      ); // if (scrollTop + clientHeight >= scrollHeight - 1) { call Api}
      if (data) {
        if (actorType === ActorType.RECEIVER) {
          setPendingInvitationList((prev) => {
            return [...prev, ...data.invitationList];
          });
          setPendingPageEntity((prev) => ({
            ...prev,
            currentPage: prev.currentPage! + 1,
            totalPage: data.totalPage,
          }));
        } else {
          setSendInvitationList((prev) => {
            return [...prev, ...data.invitationList];
          });
          setSendPageEntity((prev) => ({
            ...prev,
            currentPage: prev.currentPage! + 1,
            totalPage: data.totalPage,
          }));
        }
      }
    }
  };
  useEffect(() => {
    pendingInvitationApi.callApi(async () => {
      const data = await getInvitationList(
        pendingPageEntity,
        userId!,
        ActorType.RECEIVER,
      );
      setPendingInvitationList(data.invitationList);
      setPendingPageEntity((prev) => ({
        ...prev,
        totalPage: data.totalPage,
      }));
    });
    sendInvitationApi.callApi(async () => {
      const data = await getInvitationList(
        sendPageEntity,
        userId!,
        ActorType.SENDER,
      );
      setSendInvitationList(data.invitationList);
      setSendPageEntity((prev) => ({
        ...prev,
        totalPage: data.totalPage,
      }));
    });
  }, []);

  useEffect(() => {
    const element = pendingScrollRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [pendingPageEntity, actorType, sendPageEntity]);
  return (
    <div className="flex size-full flex-col rounded-xl bg-white shadow-[0px_0px_20px_-0px_rgba(0,0,0,0.3)]">
      <h1 className="mx-8 my-4 text-16 font-7">Invitation</h1>
      <section className="flex items-center justify-center gap-4">
        <div className="relative">
          <button
            className={`w-[12rem] select-none text-12 font-5 uppercase ${actorType === ActorType.RECEIVER ? 'text-primary-5' : ''} transition-colors duration-700`}
            onClick={() => {
              swiperRef.current.swiper.slideTo(0);
            }}
          >
            Pending Friend
          </button>
          <button
            className={`w-[12rem] select-none text-12 font-5 uppercase ${actorType === ActorType.SENDER ? 'text-primary-5' : ''} transition-colors duration-700`}
            onClick={() => {
              swiperRef.current.swiper.slideTo(1);
            }}
          >
            Your Invitation
          </button>
          <div
            className={`absolute bottom-[-4px] left-0 w-[12rem] border-[2px] border-primary-3 ${actorType === ActorType.SENDER ? 'translate-x-[12rem]' : ''} transition-transform duration-700`}
          ></div>
        </div>
      </section>
      <hr />
      <section
        className="mx-auto grow overflow-auto py-10"
        ref={pendingScrollRef}
      >
        <Swiper
          className="mx-auto max-w-[40rem] grow overflow-auto py-10"
          ref={swiperRef}
          speed={800}
        >
          <SwiperSlide className="cursor-pointer">
            {/*  */}
            {({ isActive }) => {
              if (isActive) {
                setActorType(ActorType.RECEIVER);
              }
              return (
                <>
                  {pendingInvitationList.map((item) => (
                    <PendingFriendItemComponent
                      entity={item}
                      key={item.invitationId}
                    />
                  ))}
                </>
              );
            }}
          </SwiperSlide>
          <SwiperSlide className="cursor-pointer">
            {({ isActive }) => {
              if (isActive) {
                setActorType(ActorType.SENDER);
              }
              return (
                <>
                  {sendInvitationList.map((item) => (
                    <SendInvitationComponent
                      entity={item}
                      key={item.invitationId}
                    />
                  ))}
                </>
              );
            }}
          </SwiperSlide>
        </Swiper>
      </section>
    </div>
  );
}

export default FriendInvitationPage;
