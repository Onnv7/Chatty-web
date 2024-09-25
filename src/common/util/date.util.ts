import dayjs from 'dayjs';

export const formatYMD = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export function formatDateConversation(date: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date >= today) {
    // Nếu là ngày hiện tại
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else if (date >= yesterday) {
    // Nếu là ngày hôm qua
    return 'yesterday';
  } else {
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = Math.floor(diffDays / 365);

    if (diffDays < 365) {
      // Nếu là trong năm nay
      return date.toLocaleDateString('en-GB'); // DD/MM
    } else {
      // Nếu đã qua 1 năm
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    }
  }
}
