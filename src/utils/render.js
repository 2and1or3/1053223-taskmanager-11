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
    parentElement.replaceChild(newElement, oldElement);
  }
};

const removeComponent = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export {createElement, render, replace, removeComponent};
