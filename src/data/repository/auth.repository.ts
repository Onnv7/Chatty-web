import { formatYMD } from '../../common/util/date.util';
import { LoginAccountEntity } from '../../domain/entity/login.entity';
import { RegisterAccountEntity } from '../../domain/entity/register.entity';
import { AuthAPI } from '../api/auth.api';
import { AuthLocalStorage } from '../local/auth.localstorage';
import {
  LoginAccountRequest,
  RegisterAccountRequest,
} from '../model/request/auth.request';
import { LoginAccountResponse } from '../model/response/auth.response';

export class AuthRepository {
  constructor(
    private authApi: AuthAPI,
    private authLocalStorage: AuthLocalStorage,
  ) {}
  async loginAccount(entity: LoginAccountEntity) {
    const body: LoginAccountRequest = {
      username: entity.username,
      password: entity.password,
    };
    const data = await this.authApi.loginAccount(body);
    return data;
  }

  async registerAccount(data: RegisterAccountEntity) {
    const body: RegisterAccountRequest = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      gender: data.gender,
      birthDate: formatYMD(data.birthDate),
    };
    await this.authApi.registerAccount(body);
  }

  // async updatePassword(userId: number, data: UpdatePasswordEntity) {
  //   await this.authApi.updatePassword(userId, data);
  // }

  savingUserAuth(data: LoginAccountResponse) {
    this.authLocalStorage.saveCredentials(data);
  }

  clearCredentials() {
    this.authLocalStorage.clearCredentials();
  }

  getUserId() {
    return this.authLocalStorage.getUserId();
  }

  getAccessToken() {
    return this.authLocalStorage.getAccessToken();
  }

  // async validateGoogleAccount(header: GoogleAuthEntity) {
  //   return await this.authApi.validateGoogleAccount({ ...header });
  // }

  // async refreshToken(): Promise<RefreshTokenEntity> {
  //   return await this.authApi.refreshToken();
  // }
}
