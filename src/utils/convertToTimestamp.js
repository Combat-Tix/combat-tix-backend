export const convertToTimestamp = async ({ date, startTime }) => {
  const formattedDate = `${date.toISOString().split("T")[0]}T${startTime}:00.000Z`;
  const unixTimeStamp = Math.floor(new Date(formattedDate).getTime() / 1000);
  return unixTimeStamp;
};
