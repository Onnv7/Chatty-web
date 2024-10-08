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

export function timeAgo(inputDate: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - inputDate.getTime(); // Khoảng cách thời gian tính bằng milliseconds
  const diffSeconds = Math.floor(diffMs / 1000); // Chuyển đổi ra giây
  const diffMinutes = Math.floor(diffSeconds / 60); // Chuyển đổi ra phút
  const diffHours = Math.floor(diffMinutes / 60); // Chuyển đổi ra giờ
  const diffDays = Math.floor(diffHours / 24); // Chuyển đổi ra ngày
  const diffMonths = Math.floor(diffDays / 30); // Chuyển đổi ra tháng (ước tính trung bình)
  const diffYears = Math.floor(diffMonths / 12); // Chuyển đổi ra năm

  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 30) {
    return `${diffDays}d ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths}m ago`;
  } else {
    return `${diffYears}y ago`;
  }
}
export function formatDateWithWeekday(inputDate: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - inputDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const hours = inputDate.getHours();
  const minutes = inputDate.getMinutes();
  const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

  if (diffDays <= 7) {
    const weekdayOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
    };
    const weekday = inputDate.toLocaleDateString('en-US', weekdayOptions);
    return `${weekday}, ${inputDate.toLocaleDateString('en-US', options)} at ${timeString}`;
  }

  return `${inputDate.toLocaleDateString('en-US', options)} at ${timeString}`;
}
