import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ErrorResponseEntity } from '../../data/model/api.model';

const ErrorMessageCode = {
  1602: 'Invalid login account',
  1801: 'Email already exists please choose another email',
};
export const handleException = (e: any) => {
  e = e as Error;
  console.log('🚀 ~ handleException ~ e:', e.response?.data.error);
  if (e instanceof AxiosError) {
    const error: ErrorResponseEntity = e.response?.data.error;
    const msg =
      ErrorMessageCode[error.subErrorCode as keyof typeof ErrorMessageCode];
    toast.error(msg ?? 'The system is busy, please try again later.', {
      type: 'error',
    });
  } else {
    toast.error('System error, please contact administrator', {
      type: 'error',
    });
  }
};
