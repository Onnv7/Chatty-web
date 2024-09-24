import { Gender } from '../../common/constant/enum';

export type RegisterAccountEntity = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: Date;
  gender: Gender;
};
