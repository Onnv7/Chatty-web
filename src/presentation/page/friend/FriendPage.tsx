import SEARCH_ICON from '@icon/search_icon.svg';
import GRID_ICON from '@icon/grid_icon.svg';
import GRID_ICON_SELECTED from '@icon/grid_icon_cyan.svg';
import LIST_ICON from '@icon/list_icon.svg';
import LIST_ICON_SELECTED from '@icon/list_icon_cyan.svg';
import NOT_FOUND_DATA_IMAGE from '@image/not_found_image.gif';
import { useEffect, useRef, useState } from 'react';
import FriendCardComponent from './components/FriendCardComponent';
import FriendListItemComponent from './components/FriendListItemComponent';
import { useCallApi } from '../../../common/hook/useCallApi';
import {
  scrollNextPageSearchFriend,
  searchFriend,
} from '../../../domain/usecase/friend.usecase';
import { FriendSearchEntity } from '../../../domain/entity/friend.entity';
import usePagination from '../../../common/hook/usePagination';
import { PageEntity } from '../../../domain/entity/common.entity';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../../common/context/auth.context';

function FriendPage() {
  const { userId } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKey = searchParams.get('key') || '';
  const [displayMode, setDisplayMode] = useState(0);
  const searchApi = useCallApi();
  // const [searchKey, setSearchKey] = useState('');
  const [searchText, setSearchText] = useState(searchKey);
  const [friendList, setFriendList] = useState<FriendSearchEntity[]>([]);
  const scrollResultRef = useRef<HTMLSpanElement>(null);
  const [pageEntity, setPageEntity] = useState<PageEntity>({
    pageSize: 30,
    currentPage: 0,
  });
  const [isDirtyInput, setIsDirtyInput] = useState(false);

  function handleSearch() {
    if (searchText.trim() !== '') {
      setSearchParams({ key: searchText });
      searchApi.callApi(async () => {
        const { totalPage, friendList } = await searchFriend(
          1,
          pageEntity.pageSize,
          userId!,
          searchText,
        );
        setPageEntity((prev) => ({
          ...prev,
          currentPage: 1,
          totalPage: totalPage,
        }));
        setFriendList(friendList);
        setIsDirtyInput(true);
      });
    } else {
      const params = new URLSearchParams(location.search);
      params.delete('key');
      const newSearch = params.toString();
      if (newSearch) {
        navigate({ search: newSearch });
      } else {
        navigate({ search: '' }); // Reset về URL không có query string
      }
      setIsDirtyInput(false);
      setFriendList([]);
    }
  }

  useEffect(() => {
    if (searchText.trim() !== '') {
      searchApi.callApi(async () => {
        const { totalPage, friendList } = await searchFriend(
          1,
          pageEntity.pageSize,
          userId!,
          searchKey,
        );
        setPageEntity((prev) => ({
          ...prev,
          currentPage: 1,
          totalPage: totalPage,
        }));
        setFriendList(friendList);
      });
    }
  }, []);

  const handleScroll = async () => {
    if (scrollResultRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = scrollResultRef.current;
      const data = await scrollNextPageSearchFriend(
        pageEntity,
        userId!,
        scrollTop,
        clientHeight,
        scrollHeight,
        searchKey,
      );
      if (data) {
        setPageEntity((prev) => ({
          ...prev,
          currentPage: prev.currentPage! + 1,
          totalPage: data.totalPage,
        }));
        setFriendList((prev) => {
          return [...prev, ...data.friendList];
        });
      }
    }
  };
  useEffect(() => {
    const element = scrollResultRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [pageEntity]);
  const navigate = useNavigate();
  return (
    <div className="flex size-full flex-col rounded-xl bg-white shadow-[0px_0px_20px_-0px_rgba(0,0,0,0.3)]">
      <h1 className="mx-8 my-4 text-16 font-7">Let find your friends</h1>
      <section className="p-2">
        <div className="relative mx-4 flex rounded-[0.8rem] bg-[#eee8e8] p-2">
          <img src={SEARCH_ICON} alt="" className="absolute size-[1.4rem]" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              if (e.target.value.trim() === '') {
              }
              setSearchText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="ml-[1.6rem] grow bg-transparent outline-none"
            placeholder="Search your friends"
          />
        </div>
      </section>
      <hr />
      <section className="mb-3 flex grow flex-col overflow-hidden">
        <div className="mx-auto my-2 flex w-[80%] justify-end gap-4">
          <img
            src={displayMode === 0 ? GRID_ICON_SELECTED : GRID_ICON}
            alt=""
            className="size-[1.5rem] cursor-pointer"
            onClick={() => setDisplayMode(0)}
          />
          <img
            src={displayMode === 1 ? LIST_ICON_SELECTED : LIST_ICON}
            alt=""
            className="size-[1.6rem] cursor-pointer"
            onClick={() => setDisplayMode(1)}
          />
        </div>
        <span className="grow overflow-auto" ref={scrollResultRef}>
          <div className="mx-auto h-full w-[80%]">
            {friendList.length === 0 && isDirtyInput && (
              <div className="flex size-full items-center justify-center">
                <img src={NOT_FOUND_DATA_IMAGE} alt="" className="" />
              </div>
            )}
            {displayMode === 0 && friendList ? (
              <section className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] items-center justify-items-center align-middle">
                {friendList.map((item) => (
                  <FriendCardComponent data={item} key={item.profileId} />
                ))}
              </section>
            ) : (
              <section className="flex flex-col gap-4">
                {friendList.map((item) => (
                  <FriendListItemComponent data={item} key={item.profileId} />
                ))}
              </section>
            )}
          </div>
        </span>
      </section>
    </div>
  );
}

export default FriendPage;
