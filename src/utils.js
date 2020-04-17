const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes}`;
};

const checkDate = (date) => {
  return date < Date.now();
};

export {formatTime, checkDate};
