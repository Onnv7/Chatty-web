import { http } from '../../common/config/http.config';
import {
  LoginAccountRequest,
  RegisterAccountRequest,
} from '../model/request/auth.request';
import { LoginAccountResponse } from '../model/response/auth.response';

export class AuthAPI {
  constructor() {}

  async registerAccount(body: RegisterAccountRequest) {
    const responseData = (await http.post('/auth/register', body)).data;
    return responseData.data;
  }

  async loginAccount(body: LoginAccountRequest): Promise<LoginAccountResponse> {
    const responseData = (await http.post('/auth/login', body)).data;
    return responseData.data;
  }
}
