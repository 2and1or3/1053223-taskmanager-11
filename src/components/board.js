import AbstractComponent from './abstract-component.js';

const createBoardContainer = () => `<section class="board container"></section>`;

class Board extends AbstractComponent {
  getTemplate() {
    return createBoardContainer();
  }
}

export default Board;
