const RENDER_POSITIONS = {
  APPEND: `append`,
  BEFORE: `before`,
};

const createElement = (template) => {
  const container = document.createElement(`div`);
  container.innerHTML = template;

  return container.firstChild;
};

const render = (containerElement, component, position = RENDER_POSITIONS.APPEND) => {
  switch (position) {
    case RENDER_POSITIONS.APPEND:
      containerElement.append(component.getElement());
      break;

    case RENDER_POSITIONS.BEFORE:
      containerElement.before(component.getElement());
      break;
  }
};

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

export {createElement, render, replace, removeComponent, RENDER_POSITIONS};
