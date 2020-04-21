import {createElement} from '../utils.js';

const createCardsContainer = () => `<div class="board__tasks"></div>`;

class CardsContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCardsContainer();
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

export default CardsContainer;
