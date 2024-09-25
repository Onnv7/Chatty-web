import { toast } from 'react-toastify';

type ToastNotificationType = {
  msg: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
};
export const toastNotification = ({
  msg,
  type = 'success',
  position = 'top-center',
}: ToastNotificationType) => {
  toast(msg, {
    type,
    position,
  });
};