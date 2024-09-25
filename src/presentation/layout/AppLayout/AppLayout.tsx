import { Outlet } from 'react-router-dom';
import SideMenuComponent from './components/SideMenu/SideMenuComponent';

const AppLayout = () => {
  return (
    <div className="h-[100vh] w-[100vw] bg-gray-200">
      <div className="flex flex-row gap-2 size-full">
        <SideMenuComponent className="" />
        <div className="p-2 grow">
          <Outlet />
        </div>
        {/* <BannerSubscribeComponent /> */}
      </div>
      <div></div>
    </div>
  );
};

export default AppLayout;
