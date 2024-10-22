import { Gender } from '../../../common/constant/enum';

export type GetUserProfileResponse = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  gender: Gender;
  birthDate: Date;
};
