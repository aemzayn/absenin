import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const dateToString = (date: Date) => {
  return dayjs(date).utc(true).format("DD/MM/YYYY");
};

export const timestamp = (date: Date) => {
  return dayjs(date).utc(true).format("HH:mm:ss DD/MM/YYYY");
};
