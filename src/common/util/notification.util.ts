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
  if (msg && msg.trim().length > 0)
    toast(msg, {
      type,
      position,
    });
};
