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
import { useState } from 'react';
type SideMenuComponentProps = {
  className?: string;
};

const itemNav = [
  {
    name: 'Home',
    icon: HOME_ICON,
    iconSelected: HOME_ICON_SELECTED,
  },

  {
    name: 'Conversation',
    icon: CHAT_ICON,
    iconSelected: CHAT_ICON_SELECTED,
  },
  {
    name: 'Friend',
    icon: FRIEND_ICON,
    iconSelected: FRIEND_ICON_SELECTED,
  },
  {
    name: 'Setting',
    icon: SETTING_ICON,
    iconSelected: SETTING_ICON_SELECTED,
  },
];
function SideMenuComponent({ className = '' }: SideMenuComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [navItemSelected, setNavItemSelected] = useState(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
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
          if (index < 3)
            return (
              <div
                className={`${isOpen ? '' : 'size-[2rem]'} flex cursor-pointer items-center gap-2 font-5 ${navItemSelected === index ? 'bg-[#eafafa]' : ''} rounded-md p-1`}
                onClick={() => {
                  setNavItemSelected(index);
                }}
              >
                {navItemSelected === index && (
                  <div className="border-primary-4 absolute left-[0px] h-[2rem] rounded-r-md border-[2px]"></div>
                )}
                <img
                  src={
                    navItemSelected === index ? item.iconSelected : item.icon
                  }
                  alt=""
                  className={` ${isOpen ? 'size-[1.6rem]' : 'size-full'}`}
                />
                {isOpen && (
                  <h3
                    className={`${navItemSelected === index ? 'text-primary-5' : ''}`}
                  >
                    {item.name}
                  </h3>
                )}
              </div>
            );
        })}
      </section>
      <section>
        {itemNav.map((item, index) => {
          if (index >= 3)
            return (
              <div
                className={`${isOpen ? '' : 'size-[2rem]'} flex cursor-pointer items-center gap-2 font-5 ${navItemSelected === index ? 'bg-[#eafafa]' : ''} rounded-md p-1`}
                onClick={() => {
                  setNavItemSelected(index);
                }}
              >
                {navItemSelected === index && (
                  <div className="border-primary-4 absolute left-[0px] h-[2rem] rounded-r-md border-[2px]"></div>
                )}
                <img
                  src={
                    navItemSelected === index ? item.iconSelected : item.icon
                  }
                  alt=""
                  className={` ${isOpen ? 'size-[1.6rem]' : 'size-full'}`}
                />
                {isOpen && (
                  <h3
                    className={`${navItemSelected === index ? 'text-primary-5' : ''}`}
                  >
                    {item.name}
                  </h3>
                )}
              </div>
            );
        })}
      </section>
    </div>
  );
}

export default SideMenuComponent;
