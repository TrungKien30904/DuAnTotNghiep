export function formatDateFromArray(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return "Chưa có";

  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute, second);

  const pad = (n) => n.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
