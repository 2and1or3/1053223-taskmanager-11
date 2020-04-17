const formatTime = (date) => {
  const hours = date.getHours();
  let minutes = String(date.getMinutes()).padStart(2, 0);
  return `${hours}:${minutes}`;
};

const checkDate = (date) => {
  return date < Date.now();
};

export {formatTime, checkDate};
