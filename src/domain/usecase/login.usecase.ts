import { httpAuth } from '../../common/config/http.config';
import authRepository from '../../data/repository/auth';
import { LoginAccountEntity } from '../entity/login.entity';

export async function loginAccount(entity: LoginAccountEntity) {
  const data = await authRepository.loginAccount(entity);
  authRepository.savingUserAuth(data);
  httpAuth.defaults.headers.common['Authorization'] =
    `Bearer ${data.accessToken}`;
  return data;
}
