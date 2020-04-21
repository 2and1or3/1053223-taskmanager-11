import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';
import SortComponent from './components/sort.js';
import CardEditorComponent from './components/card-editor.js';
import CardComponent from './components/card.js';
import LoadButtonComponent from './components/load-button.js';
import BoardComponent from './components/board.js';
import CardsContainerComponent from './components/cards-container.js';
import NoTaskComponent from './components/no-task.js';

import {render, checkDate} from './utils.js';
import {FILTER_TYPES} from './const.js';
import {tasksData} from './mock/task.js';

const CARDS_STEP = 8;

const PRESS_KEY = {
  ESC: 27,
};

const filters = {
  [FILTER_TYPES.ALL]: {
    title: `All`,
    count: null,
  },
  [FILTER_TYPES.OVERDUE]: {
    title: `Overdue`,
    count: null,
  },
  [FILTER_TYPES.TODAY]: {
    title: `Today`,
    count: null,
  },
  [FILTER_TYPES.FAVORITES]: {
    title: `Favorites`,
    count: null,
  },
  [FILTER_TYPES.REPEATING]: {
    title: `Repeating`,
    count: null,
  },
  [FILTER_TYPES.ARCHIVE]: {
    title: `Archive`,
    count: null,
  },
};

const updateFilters = (tasks) => {

  filters[FILTER_TYPES.ALL].count = tasks.length;

  const today = new Date();
  tasks.forEach((task) => {
    if (checkDate(task.dueDate)) {
      filters[FILTER_TYPES.OVERDUE].count++;
    }

    if (task.dueDate && task.dueDate.getDate() === today.getDate()) {
      filters[FILTER_TYPES.TODAY].count++;
    }

    if (task.isFavorite) {
      filters[FILTER_TYPES.FAVORITES].count++;
    }


    if (Object.values(task.repeatDays).some(Boolean)) {
      filters[FILTER_TYPES.REPEATING].count++;
    }

    if (task.isArchive) {
      filters[FILTER_TYPES.ARCHIVE].count++;
    }
  });
};

updateFilters(tasksData);

const quantityOfTasks = tasksData.length;


const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.control`);

render(mainControl, new MenuComponent().getElement());
render(main, new FiltersComponent(filters).getElement());

const isEmptyBoard = () => !quantityOfTasks;

const renderCard = (cardsContainer, task) => {
  const cardComponent = new CardComponent(task);
  render(cardsContainer, cardComponent.getElement());

  const cardEdit = cardComponent.getElement().querySelector(`.card__btn--edit`);


  const cardEditorComponent = new CardEditorComponent(task);
  const editorForm = cardEditorComponent.getElement().querySelector(`form`);

  const openEditor = (evt) => {
    evt.preventDefault();
    cardsContainer.replaceChild(cardEditorComponent.getElement(), cardComponent.getElement());
    document.addEventListener(`keydown`, onEscPress);
  };

  const closeEditor = (evt) => {
    evt.preventDefault();
    cardsContainer.replaceChild(cardComponent.getElement(), cardEditorComponent.getElement());
    document.removeEventListener(`keydown`, onEscPress);
  };

  const onEscPress = (evt) => {
    evt.preventDefault();
    if (evt.keyCode === PRESS_KEY.ESC) {
      closeEditor(evt);
    }
  };

  const onEditClick = (evt) => openEditor(evt);

  const onEditorFormSubmit = (evt) => closeEditor(evt);

  cardEdit.addEventListener(`click`, onEditClick);
  editorForm.addEventListener(`submit`, onEditorFormSubmit);
};

const renderBoard = (boardContainer, tasks) => {
  const boardComponent = new BoardComponent();
  render(boardContainer, boardComponent.getElement());

  if (isEmptyBoard()) {
    const noTaskComponent = new NoTaskComponent();
    render(boardComponent.getElement(), noTaskComponent.getElement());
  } else {

    const sortComponent = new SortComponent();
    render(boardComponent.getElement(), sortComponent.getElement());


    const cardsContainerComponent = new CardsContainerComponent();
    render(boardComponent.getElement(), cardsContainerComponent.getElement());


    let visibleCards = 0;
    let addCardStep = () => visibleCards + CARDS_STEP;

    const loadMore = (begin, end) => {
      tasks
      .slice(begin, end)
      .forEach((task) => renderCard(cardsContainerComponent.getElement(), task));

      const diffrence = end - begin;
      visibleCards += diffrence;
    };

    loadMore(0, CARDS_STEP);

    const onLoadButtonClick = (evt) => {
      evt.preventDefault();

      const isCardEnd = addCardStep() >= quantityOfTasks;

      const currentEnd = isCardEnd ? quantityOfTasks : addCardStep();

      loadMore(visibleCards, currentEnd);

      if (isCardEnd) {
        loadButtonComponent.getElement().remove();
        loadButtonComponent.removeElement();
      }
    };

    const loadButtonComponent = new LoadButtonComponent();
    render(boardComponent.getElement(), loadButtonComponent.getElement());

    loadButtonComponent.getElement().addEventListener(`click`, onLoadButtonClick);
  }
};


renderBoard(main, tasksData);
