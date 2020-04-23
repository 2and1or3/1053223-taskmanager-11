import AbstractComponent from './abstract-component.js';

const createCardsContainer = () => `<div class="board__tasks"></div>`;

class CardsContainer extends AbstractComponent {
  getTemplate() {
    return createCardsContainer();
  }
}

export default CardsContainer;
