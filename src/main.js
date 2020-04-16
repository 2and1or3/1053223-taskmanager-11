import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filter.js';
import {createSortTemplate} from './components/sort.js';
import {createCardEditorTemplate} from './components/card-editor.js';
import {createCardTemplate} from './components/card.js';
import {createLoadButtonTemplate} from './components/load-button.js';

import {generateFilters} from './mock/filter.js';
import {cards} from './mock/task.js';

const BUTTON_SHOW_CARD = 8;

const filters = generateFilters();

const cardsCount = cards.length;

const createBoardContainer = () => `<section class="board container"></section>`;

const createTaskContainer = () => `<div class="board__tasks"></div>`;

const render = function (container, template, place = `beforeend`) {
  container.insertAdjacentHTML(place, template);
};

const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.control`);

render(mainControl, createMenuTemplate());
render(main, createFiltersTemplate(filters));
render(main, createBoardContainer());

const board = main.querySelector(`.board`);
render(board, createSortTemplate());
render(board, createTaskContainer());

const tasks = board.querySelector(`.board__tasks`);
render(tasks, createCardEditorTemplate(cards[0]));


let cardEnd = 1;

const loadCard = () => {
  const newCardEnd = (cardEnd + BUTTON_SHOW_CARD) > cardsCount ? cardsCount : cardEnd + BUTTON_SHOW_CARD;

  for (let i = cardEnd; i < newCardEnd; i++) {
    render(tasks, createCardTemplate(cards[i]));
  }
  cardEnd = newCardEnd;
};

loadCard();

render(board, createLoadButtonTemplate());

const loadButton = board.querySelector(`.load-more`);

loadButton.addEventListener(`click`, () => {
  loadCard();
  if (cardEnd >= cardsCount) {
    loadButton.remove();
  }
});
