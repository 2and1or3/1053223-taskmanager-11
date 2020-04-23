import {createElement} from '../utils.js';

const CREATE_INSTANCE_ERR = `Can't instantiate AbstractComponent, only concrete one.`;
const IMPLEMENT_METHOD_ERR = `Abstract method not implemented: getTemplate`;

class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(CREATE_INSTANCE_ERR);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(IMPLEMENT_METHOD_ERR);
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
