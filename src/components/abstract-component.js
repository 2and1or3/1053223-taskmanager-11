import {createElement} from '../utils/render.js';

const METHODS_TO_IMPLEMENT = {
  GET_TEMPLATE: `getTemplate`,
  RECOVERY_LISTENERS: ` recoveryListeners`,
};

const ERRORS = {
  INSTANCE: `Can't instantiate AbstractComponent, only concrete one.`,
  getImplementMessage: (nameMethod) => `Abstract method not implemented: ${nameMethod}`,
};

class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(ERRORS.INSTANCE);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(ERRORS.getImplementMessage(METHODS_TO_IMPLEMENT.GET_TEMPLATE));
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default AbstractComponent;
export {METHODS_TO_IMPLEMENT, ERRORS};
