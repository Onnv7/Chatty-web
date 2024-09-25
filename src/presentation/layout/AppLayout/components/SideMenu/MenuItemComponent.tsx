import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type MenuItemComponentProps = {
  name: string;
  iconSelected?: string;
  icon: string;
  navigateTo?: string;
  itemIndex: number;
  isOpenSideBar: boolean;
  subList?: {
    name: string;
    navigateTo?: string;
    subItemOnClick?: () => {};
  }[];
  itemOnClick?: () => void;
  itemSelected: boolean;
  setNavItemSelected: React.Dispatch<React.SetStateAction<number>>;
};

function MenuItemComponent({
  subList,
  name,
  iconSelected,
  icon,
  navigateTo,
  itemIndex,
  itemOnClick,
  isOpenSideBar,
  itemSelected,
  setNavItemSelected,
}: MenuItemComponentProps) {
  const [subIndexSelected, setSubIndexSelected] = useState(0);
  const [isOpenSubList, setIsOpenSubList] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${isOpenSideBar ? '' : 'size-[2rem]'} flex cursor-pointer items-center gap-2 font-5 ${itemSelected ? 'bg-[#eafafa]' : ''} rounded-md p-1`}
        onClick={() => {
          setNavItemSelected(itemIndex);
          console.log('🚀 ~ navigateTo:', navigateTo);
          setIsOpenSubList((prev) => !prev);
          if (itemOnClick) {
            itemOnClick();
          }
          if (navigateTo) {
            console.log('🚀 ~ navigateTo:', navigateTo);
            navigate(navigateTo);
          }
        }}
      >
        {itemSelected && (
          <div className="fixed left-[0px] h-[2rem] rounded-r-md border-[2px] border-primary-4"></div>
        )}
        <img
          src={itemSelected ? iconSelected : icon}
          alt=""
          className={` ${isOpenSideBar ? 'size-[1.6rem]' : 'size-full'}`}
        />
        {isOpenSideBar && (
          <h3 className={`${itemSelected ? 'text-primary-5' : ''} select-none`}>
            {name}
          </h3>
        )}
      </div>
      {!isOpenSideBar && subList && isHovered && (
        <div className="absolute left-[100%] top-[50%] w-fit -translate-y-[50%] pl-2">
          <ul className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-[0px_0px_20px_-5px_rgba(0,0,0,0.3)]">
            {subList.map((subItem, subIndex) => {
              const isSubIndexSelected =
                subIndexSelected === subIndex && itemSelected;
              return (
                <li
                  className={`cursor-pointer rounded-xl px-2 py-1 hover:bg-cyan-100 ${isSubIndexSelected ? 'text-primary-4' : ''}`}
                  onClick={() => {
                    setSubIndexSelected(subIndex);
                    setNavItemSelected(itemIndex);
                    if (subItem.subItemOnClick) {
                      subItem.subItemOnClick();
                    }
                    if (subItem.navigateTo) {
                      navigate(subItem.navigateTo);
                    }
                  }}
                >
                  {subItem.name}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {isOpenSideBar && subList && (
        <div
          className={`${isOpenSubList ? 'hidden' : 'visible'} mt-2 flex flex-col gap-2`}
        >
          {subList.map((subItem, subIndex) => {
            const isSubIndexSelected =
              subIndexSelected === subIndex && itemSelected;
            return (
              <div
                className={`${isOpenSideBar ? '' : 'size-[2rem]'} flex cursor-pointer items-center gap-2 font-5 ${isSubIndexSelected ? '' : ''} $ rounded-md p-1 transition-all`}
                onClick={() => {
                  setSubIndexSelected(subIndex);
                  setNavItemSelected(itemIndex);
                  if (subItem.subItemOnClick) {
                    subItem.subItemOnClick();
                  }
                  if (subItem.navigateTo) {
                    navigate(subItem.navigateTo);
                  }
                }}
              >
                {/* {isSubIndexSelected && (
                <div className="absolute left-[0px] h-[2rem] rounded-r-md border-[2px] border-primary-4"></div>
              )} */}
                {/* <img
                src={
                  subItemIndexSelected === subIndex
                    ? iconSelected
                    : item.icon
                }
                alt=""
                className={` ${isOpenSideBar ? 'size-[1.6rem]' : 'size-full'}`}
              /> */}
                {isOpenSideBar && (
                  <h3
                    className={`${isSubIndexSelected ? 'text-primary-4' : ''} ml-8 select-none`}
                  >
                    {subItem.name}
                  </h3>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MenuItemComponent;
