const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, 0);
  return `${hours}:${minutes}`;
};

const checkDate = (date) => {
  return date < Date.now();
};

const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;

  return container.firstChild;
};

const render = (container, element) => {
  container.append(element);
};

export {formatTime, checkDate, createElement, render};
