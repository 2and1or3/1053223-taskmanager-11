import SortComponent, {SORT_TYPES} from '../components/sort.js';
import LoadButtonComponent from '../components/load-button.js';
import BoardComponent from '../components/board.js';
import CardsContainerComponent from '../components/cards-container.js';
import NoTaskComponent from '../components/no-task.js';

import CardController from './card-controller.js';

import {render, removeComponent} from '../utils.js';

const CARDS_STEP = 8;

const SORT_FUNCTIONS = {
  [SORT_TYPES.DATE_UP]: (leftTask, rightTask) => leftTask.dueDate - rightTask.dueDate,
  [SORT_TYPES.DATE_DOWN]: (leftTask, rightTask) => rightTask.dueDate - leftTask.dueDate,
};


class BoardController {
  constructor(container) {
    this._container = container;
    this._initialTasks = null;
    this._tasksToRender = null;
    this._visibleCards = 0;
    this._boardComponent = new BoardComponent();
    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._cardsContainerComponent = new CardsContainerComponent();
    this._loadButtonComponent = new LoadButtonComponent();
  }

  getSortedTasks(sortFuncKey) {
    const sorted = this._initialTasks.slice(0);

    sorted.sort(SORT_FUNCTIONS[sortFuncKey]);

    return sorted;
  }

  loadMore(begin, end, currentTasks) {
    currentTasks
      .slice(begin, end)
      .forEach((task) => {
        const cardController = new CardController(this._cardsContainerComponent.getElement());
        cardController.render(task);
      });

    const diffrence = end - begin;
    this._visibleCards += diffrence;
  }

  loadButtonHandler(evt) {
    evt.preventDefault();
    const addCardStep = () => this._visibleCards + CARDS_STEP;

    const isCardEnd = addCardStep() >= this._initialTasks.length;

    const currentEnd = isCardEnd ? this._initialTasks.length : addCardStep();

    this.loadMore(this._visibleCards, currentEnd, this._tasksToRender);

    if (isCardEnd) {
      removeComponent(this._loadButtonComponent);
    }
  }

  clear() {
    this._cardsContainerComponent.getElement().innerHTML = ``;
    removeComponent(this._loadButtonComponent);
  }

  repeatRenderBoard(sortKey) {
    this._tasksToRender = this.getSortedTasks(sortKey);
    this.clear();
    this._visibleCards = 0;
    this.loadMore(0, CARDS_STEP, this._tasksToRender);
    render(this._boardComponent.getElement(), this._loadButtonComponent);
    this._loadButtonComponent.setClickHandler(this.loadButtonHandler.bind(this));
  }

  sortClickHandler(evt) {
    const oldSortType = this._sortComponent.getCurrentSortType();
    this._sortComponent.setCurrentSortType(evt);
    const isChanged = oldSortType !== this._sortComponent.getCurrentSortType();

    if (isChanged) {
      this.repeatRenderBoard(this._sortComponent.getCurrentSortType());
    }
  }

  render(tasks) {
    this._initialTasks = tasks;
    this._tasksToRender = this._initialTasks;
    const isEmptyBoard = !this._initialTasks.length;

    render(this._container, this._boardComponent);

    if (isEmptyBoard) {
      render(this._boardComponent.getElement(), this._noTaskComponent);
    } else {
      render(this._boardComponent.getElement(), this._sortComponent);
      render(this._boardComponent.getElement(), this._cardsContainerComponent);
      render(this._boardComponent.getElement(), this._loadButtonComponent);


      this.loadMore(0, CARDS_STEP, this._tasksToRender);

      this._sortComponent.setClickHandler(this.sortClickHandler.bind(this));
      this._loadButtonComponent.setClickHandler(this.loadButtonHandler.bind(this));
    }
  }
}

export default BoardController;
