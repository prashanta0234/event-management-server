export const formateDate = (date: Date): string => {
  const eventDate = new Date(date);

  const formattedEventDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(eventDate);

  return formattedEventDate;
};
