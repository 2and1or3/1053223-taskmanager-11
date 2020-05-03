import AbstractComponent from './abstract-component.js';
import {METHODS_TO_IMPLEMENT, ERRORS} from './abstract-component.js';

const replaceElements = (newElement, oldElement) => {
  const parentElement = oldElement.parentElement;

  const isExistElements = !!(newElement && oldElement && parentElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(ERRORS.getImplementMessage(METHODS_TO_IMPLEMENT.RECOVERY_LISTENERS));
  }

  rerender() {
    const oldElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();

    replaceElements(newElement, oldElement);

    this.recoveryListeners();
  }
}

export default AbstractSmartComponent;
