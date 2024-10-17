import CHAT_ICON from '@icon/chat_icon.svg';
import APP_ICON from '@icon/app_icon.svg';
import MENU_ICON from '@icon/menu_icon.svg';
import HOME_ICON from '@icon/home_icon.svg';
import FRIEND_ICON from '@icon/person_icon.svg';
import SETTING_ICON from '@icon/setting_icon.svg';
import HOME_ICON_SELECTED from '@icon/home_icon_cyan.svg';
import CHAT_ICON_SELECTED from '@icon/chat_icon_cyan.svg';
import FRIEND_ICON_SELECTED from '@icon/people_icon_cyan.svg';
import SETTING_ICON_SELECTED from '@icon/setting_icon_cyan.svg';
import LOGOUT_ICON from '@icon/logout_icon.svg';
import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../../../../common/context/auth.context';
import { toastNotification } from '../../../../../common/util/notification.util';
import { useNavigate } from 'react-router-dom';
import { AppRouter } from '../../../../../common/config/router.config';
import MenuItemComponent from './MenuItemComponent';
import { useSocketContext } from '../../../../../common/context/socket.context';
import { SocketNamespaces } from '../../../../../common/constant/socket.constant';
import {
  emitHeartbeat,
  emitRegisterSocket,
} from '../../../../../domain/usecase/app.usecase';
import { usePeerContext } from '../../../../../common/context/peer.context';
type SideMenuComponentProps = {
  className?: string;
};

function SideMenuComponent({ className = '' }: SideMenuComponentProps) {
  const navigate = useNavigate();
  const { userId, authDispatch } = useAuthContext();
  const { socket, disconnectSocket } = useSocketContext();
  const [isOpen, setIsOpen] = useState(true);
  const [navItemSelected, setNavItemSelected] = useState(0);
  const conversationSocket = socket(SocketNamespaces.conversation);
  // const userSocket = socket(SocketNamespaces.user);
  const itemNav = [
    {
      name: 'Home',
      icon: HOME_ICON,
      iconSelected: HOME_ICON_SELECTED,
      navigateTo: AppRouter.home.route,
    },

    {
      name: 'Conversation',
      icon: CHAT_ICON,
      iconSelected: CHAT_ICON_SELECTED,
      navigateTo: AppRouter.conversation.route,
    },
    {
      name: 'Friend',
      icon: FRIEND_ICON,
      iconSelected: FRIEND_ICON_SELECTED,
      navigateTo: AppRouter.friends.route,
      subList: [
        {
          name: 'Search',
          icon: FRIEND_ICON,
          iconSelected: FRIEND_ICON_SELECTED,
          navigateTo: AppRouter.friends.route,
          onClick: () => {},
        },
        {
          name: 'Invitation',
          icon: FRIEND_ICON,
          iconSelected: FRIEND_ICON_SELECTED,
          navigateTo: AppRouter.invitation.route,
          onClick: () => {},
        },
      ],
    },
    {
      name: 'Setting',
      icon: SETTING_ICON,
      iconSelected: SETTING_ICON_SELECTED,
    },
    {
      name: 'Logout',
      icon: LOGOUT_ICON,
      iconSelected: LOGOUT_ICON,
      onClick: () => {
        authDispatch({ type: 'LOGOUT' });
        toastNotification({ msg: 'Logout successful' });
        conversationSocket.disconnect();
      },
      navigateTo: AppRouter.login.route,
    },
  ];
  const { peer, peerId } = usePeerContext();
  const intervalRef = useRef<number | null>(null);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (peerId) {
      emitRegisterSocket(
        { userId: userId!, peerId: peer.id },
        conversationSocket,
      );
    }
  }, [peerId]);
  useEffect(() => {
    const emitData = () => {
      emitHeartbeat({ userId: userId! }, conversationSocket);
    };

    intervalRef.current = setInterval(emitData, 30000);
  }, [userId]);

  return (
    <div
      className={`${className} p-4 duration-300 ${isOpen ? 'w-[200px]' : 'w-[74px]'} flex flex-col border-r-[1px] border-gray-200 bg-white`}
    >
      <section
        className={`flex items-center ${isOpen ? 'flex-row' : 'flex-col'} justify-between`}
      >
        <div className={`flex gap-2 transition-all duration-300`}>
          <img
            src={APP_ICON}
            alt=""
            className="size-[2.4rem] transition-transform duration-300"
            style={{ transform: isOpen ? 'translateY(0)' : 'translateY(-8px)' }}
          />
          {isOpen && (
            <h1 className="text-14 font-7 transition-opacity duration-300">
              Chatty
            </h1>
          )}
        </div>

        <img
          src={MENU_ICON}
          alt=""
          className="size-[2rem] cursor-pointer transition-transform duration-300"
          onClick={toggleMenu}
          //   style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </section>
      <hr className="my-4" />

      <section
        className={`flex grow flex-col items-center gap-4 ${isOpen ? '' : 'justify-center'} child:w-full`}
      >
        {itemNav.map((item, index) => {
          const itemIndexSelected = navItemSelected === index;
          if (index < 3)
            return (
              <MenuItemComponent
                key={index}
                name={item.name}
                iconSelected={item.iconSelected}
                icon={item.icon}
                itemIndex={index}
                isOpenSideBar={isOpen}
                subList={item.subList}
                navigateTo={item.navigateTo}
                itemOnClick={item.onClick}
                itemSelected={itemIndexSelected}
                setNavItemSelected={setNavItemSelected}
              />
            );
        })}
      </section>
      <section className="flex flex-col gap-4">
        {itemNav.map((item, index) => {
          const itemIndexSelected = navItemSelected === index;
          if (index >= 3)
            return (
              <MenuItemComponent
                key={index}
                name={item.name}
                iconSelected={item.iconSelected}
                icon={item.icon}
                itemIndex={index}
                isOpenSideBar={isOpen}
                subList={item.subList}
                navigateTo={item.navigateTo}
                itemOnClick={item.onClick}
                itemSelected={itemIndexSelected}
                setNavItemSelected={setNavItemSelected}
              />
            );
        })}
      </section>
    </div>
  );
}

export default SideMenuComponent;
