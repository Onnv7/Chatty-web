import { Gender } from '../../../common/constant/enum';

export type RegisterAccountRequest = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: Gender;
  birthDate: string;
};

export type LoginAccountRequest = {
  username: string;
  password: string;
};
