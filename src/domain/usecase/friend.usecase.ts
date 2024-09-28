import { ActorType, Gender } from '../../common/constant/enum';
import { friendRepository } from '../../data/repository';
import { PageEntity } from '../entity/common.entity';
import { ProcessInvitationEntity } from '../entity/friend.entity';

export async function searchFriend(
  page: number,
  size: number,
  userId: number,
  key: string,
  gender?: Gender,
) {
  const data = await friendRepository.searchFriend(
    page,
    size,
    userId,
    key,
    gender,
  );
  return data;
}

export async function scrollNextPageSearchFriend(
  pageEntity: PageEntity,
  userId: number,
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
  searchKey: string,
) {
  if (
    pageEntity &&
    pageEntity.currentPage &&
    pageEntity.totalPage &&
    pageEntity.currentPage < pageEntity.totalPage
  ) {
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      const nextPage = pageEntity.currentPage + 1;
      const { totalPage, friendList } = await searchFriend(
        nextPage,
        pageEntity.pageSize,
        userId,
        searchKey,
      );
      return { totalPage, friendList };
    }
  }
}

export async function scrollNextPageInvitation(
  pageEntity: PageEntity,
  userId: number,
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
  actor: ActorType,
) {
  if (pageEntity.totalPage && pageEntity.currentPage < pageEntity.totalPage) {
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      const nextPage = pageEntity.currentPage + 1;
      const { totalPage, invitationList } = await getInvitationList(
        {
          currentPage: nextPage,
          pageSize: pageEntity.pageSize,
        },
        userId,
        actor,
      );
      return { totalPage, invitationList };
    }
  }
}

export async function sendInvitation(userId: number, receiverId: number) {
  const data = await friendRepository.sendInvitation(userId, receiverId);
}

export async function getInvitationList(
  pageEntity: Required<Omit<PageEntity, 'totalPage'>>,
  userId: number,
  actor: ActorType,
) {
  const data = await friendRepository.getInvitationList(
    pageEntity.currentPage,
    pageEntity.pageSize,
    userId,
    actor,
  );
  return data;
}

export async function processInvitation(entity: ProcessInvitationEntity) {
  const data = await friendRepository.processInvitation(entity);
}
