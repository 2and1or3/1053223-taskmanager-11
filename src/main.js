import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';
import SortComponent from './components/sort.js';
import CardEditorComponent from './components/card-editor.js';
import CardComponent from './components/card.js';
import LoadButtonComponent from './components/load-button.js';
import BoardComponent from './components/board.js';
import TaskContainerComponent from './components/task-container.js';

import {render} from './utils.js';

import {generateFilters} from './mock/filter.js';
import {cards} from './mock/task.js';

const CARDS_STEP = 8;

const filters = generateFilters();

const cardsCount = cards.length;


const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.control`);

render(mainControl, new MenuComponent().getElement());
render(main, new FiltersComponent(filters).getElement());


const renderTask = (taskContainer, task) => {
  const cardComponent = new CardComponent(task);
  render(taskContainer, cardComponent.getElement());

  const cardEdit = cardComponent.getElement().querySelector(`.card__btn--edit`);


  const cardEditorComponent = new CardEditorComponent(task);
  const editorForm = cardEditorComponent.getElement().querySelector(`form`);

  const onEditClick = (evt) => {
    evt.preventDefault();
    taskContainer.replaceChild(cardEditorComponent.getElement(), cardComponent.getElement());
  };

  const onEditorFormSubmit = (evt) => {
    evt.preventDefault();
    taskContainer.replaceChild(cardComponent.getElement(), cardEditorComponent.getElement());
  };

  cardEdit.addEventListener(`click`, onEditClick);
  editorForm.addEventListener(`submit`, onEditorFormSubmit);
};

const renderBoard = (boardContainer, tasks) => {
  const boardComponent = new BoardComponent();
  render(boardContainer, boardComponent.getElement());


  const sortComponent = new SortComponent();
  render(boardComponent.getElement(), sortComponent.getElement());


  const taskContainerComponent = new TaskContainerComponent();
  render(boardComponent.getElement(), taskContainerComponent.getElement());


  let visibleCards = 0;

  const loadMore = (begin, end) => {
    tasks.slice(begin, end).forEach((task) => {
      renderTask(taskContainerComponent.getElement(), task);
    });

    const diffrence = end - begin;
    visibleCards += diffrence;
  };

  loadMore(0, CARDS_STEP);

  const onLoadButtonClick = (evt) => {
    evt.preventDefault();

    const currentEnd = visibleCards + CARDS_STEP > cardsCount ? cardsCount : visibleCards + CARDS_STEP;

    loadMore(visibleCards, currentEnd);

    if (currentEnd >= cardsCount) {
      loadButtonComponent.getElement().remove();
      loadButtonComponent.removeElement();
    }
  };

  const loadButtonComponent = new LoadButtonComponent();
  render(boardComponent.getElement(), loadButtonComponent.getElement());

  loadButtonComponent.getElement().addEventListener(`click`, onLoadButtonClick);
};


renderBoard(main, cards);
