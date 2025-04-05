export function formatDateFromArray(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return "Chưa có";

  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;

  const hourFormatted = String(hour).padStart(2, '0');
  const minuteFormatted = String(minute).padStart(2, '0');
  const secondFormatted = String(second).padStart(2, '0');
  const dayFormatted = String(day).padStart(2, '0');
  const monthFormatted = String(month).padStart(2, '0');

  return `${hourFormatted}:${minuteFormatted}:${secondFormatted} ${dayFormatted}/${monthFormatted}/${year}`;

}
