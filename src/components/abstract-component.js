import {createElement} from '../utils.js';

const ERRORS = {
  INSTANCE: `Can't instantiate AbstractComponent, only concrete one.`,
  IMPLEMENT: `Abstract method not implemented: getTemplate`,
};

class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(ERRORS.INSTANCE);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(ERRORS.IMPLEMENT);
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
