import moment from "moment";

const formatTime = (date) => moment(date).format(`hh:mm`);

const formatDate = (date) => moment(date).format(`DD MMMM`);

const checkDate = (date) => date && (date < Date.now());

const isToday = (date) => {
  const today = new Date();
  return date && date.getDate() === today.getDate();
};

const isRepeating = (repeatDays) => repeatDays ? Object.values(repeatDays).some(Boolean) : repeatDays;

export {formatTime, formatDate, checkDate, isToday, isRepeating};
