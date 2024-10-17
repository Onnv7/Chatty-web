import { Outlet } from 'react-router-dom';
import SideMenuComponent from './components/SideMenu/SideMenuComponent';
import { SocketProvider } from '../../../common/context/socket.context';
import { Provider } from 'react-redux';
import { conversationStore } from '../../page/conversation/redux/conversation.store';
import { PeerProvider } from '../../../common/context/peer.context';

const AppLayout = () => {
  return (
    <PeerProvider>
      <SocketProvider>
        <div className="h-[100vh] w-[100vw] bg-gray-200">
          <div className="flex size-full flex-row gap-2">
            <SideMenuComponent className="" />
            <div className="grow p-2">
              <Outlet />
            </div>
            {/* <BannerSubscribeComponent /> */}
          </div>
          <div></div>
        </div>
      </SocketProvider>
    </PeerProvider>
  );
};

export default AppLayout;
