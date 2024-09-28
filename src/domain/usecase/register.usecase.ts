import { authRepository } from '../../data/repository';
import { RegisterAccountEntity } from '../entity/register.entity';

export async function registerAccount(entity: RegisterAccountEntity) {
  const data = await authRepository.registerAccount(entity);
}
