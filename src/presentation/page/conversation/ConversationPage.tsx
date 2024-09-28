import ConversationList from './components/ConversationList';
import ConversationChat from './components/ConversationChat';
import { useSearchParams } from 'react-router-dom';
import { Provider } from 'react-redux';
import { conversationStore } from './redux/conversation.store';
import { useAuthContext } from '../../../common/context/auth.context';

function ConversationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKey = searchParams.get('id');
  const { userId } = useAuthContext();
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(getConversationPageThunk({ userId: userId! }));
  // }, []);

  return (
    <Provider store={conversationStore}>
      <div className="flex size-full gap-2">
        <section className="basis-[20rem]">
          <ConversationList />
        </section>
        <section className="grow">{searchKey && <ConversationChat />}</section>
      </div>
    </Provider>
  );
}

export default ConversationPage;
