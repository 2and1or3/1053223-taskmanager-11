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

const render = (containerElement, component) => containerElement.append(component.getElement());

const replace = (newComponent, oldComponent) => {
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();
  const parentElement = oldElement.parentElement;

  const isExistElements = !!(newElement && oldElement && parentElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newComponent.getElement(), oldComponent.getElement());
  }
};

const removeComponent = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export {formatTime, checkDate, createElement, render, replace, removeComponent};
