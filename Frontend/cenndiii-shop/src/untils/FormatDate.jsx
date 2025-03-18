export function formatDateFromArray(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return "Chưa có";

    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute, second);

    return date.toISOString().replace("T", " ").split(".")[0]; // Format: "YYYY-MM-DD HH:mm:ss"
}