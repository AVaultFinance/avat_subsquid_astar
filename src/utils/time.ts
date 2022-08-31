export const DateFormat = (timestamp: number) => {
  // - 86400 * 1000
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const time = `${day}-${month + 1}-${year}`;
  return time;
};
