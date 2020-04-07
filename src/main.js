import createMenuTemplate from './components/menu.js';
import createFiltersTemplate from './components/filter.js';
import createSortTemplate from './components/sort.js';
import createCardEditorTemplate from './components/card-editor.js';
import createCardTemplate from './components/card.js';
import createLoadButtonTemplate from './components/load-button.js';

const CARD_COUNT = 3;

const createBoardContainer = () => `<section class="board container"></section>`;

const createTaskContainer = () => `<div class="board__tasks"></div>`;

const render = function (container, template, place = `beforeend`) {
  container.insertAdjacentHTML(place, template);
};

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.control`);

render(mainControl, createMenuTemplate());
render(main, createFiltersTemplate());
render(main, createBoardContainer());

const board = main.querySelector(`.board`);
render(board, createSortTemplate());
render(board, createTaskContainer());

const tasks = board.querySelector(`.board__tasks`);
render(tasks, createCardEditorTemplate());

for (let i = 0; i < CARD_COUNT; i++) {
  render(tasks, createCardTemplate());
}

render(board, createLoadButtonTemplate());
