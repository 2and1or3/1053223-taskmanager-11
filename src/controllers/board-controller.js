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
    this._visibleCards = 0;
    this._visibleCardControllers = [];
    this._boardComponent = new BoardComponent();
    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._cardsContainerComponent = new CardsContainerComponent();
    this._loadButtonComponent = new LoadButtonComponent();
  }

  _getSortedTasks(sortFuncKey) {
    const sorted = this._initialTasks.slice(0);

    sorted.sort(SORT_FUNCTIONS[sortFuncKey]);

    return sorted;
  }

  _loadMoreCards(begin, end, currentTasks) {
    const diffrence = end - begin;
    this._visibleCards += diffrence;

    const newCardControllers = currentTasks.slice(begin, end).map((task) => {
      const cardController = new CardController(this._cardsContainerComponent.getElement(), this._onDataChange.bind(this), this._onViewChange.bind(this));
      cardController.render(task);

      return cardController;
    });
    this._visibleCardControllers = this._visibleCardControllers.concat(newCardControllers);
  }

  _loadButtonHandler(evt) {
    evt.preventDefault();
    const addCardStep = () => this._visibleCards + CARDS_STEP;

    const isCardEnd = addCardStep() >= this._initialTasks.length;

    const currentEnd = isCardEnd ? this._initialTasks.length : addCardStep();

    const sortedTasks = this._getSortedTasks(this._sortComponent.getCurrentSortType());

    this._loadMoreCards(this._visibleCards, currentEnd, sortedTasks);

    if (isCardEnd) {
      removeComponent(this._loadButtonComponent);
    }
  }

  _resetBoard() {
    this._visibleCards = 0;
    this._visibleCardControllers = [];
    this._cardsContainerComponent.getElement().innerHTML = ``;
    removeComponent(this._loadButtonComponent);
  }

  _renderLoadButton() {
    render(this._boardComponent.getElement(), this._loadButtonComponent);
    this._loadButtonComponent.setClickHandler(this._loadButtonHandler.bind(this));
  }

  _onDataChange(oldData, newData) {
    const taskIndex = this._initialTasks.findIndex((task) => task === oldData);
    const isExist = taskIndex !== -1;

    if (isExist) {
      const cardControllerIndex = this._visibleCardControllers.findIndex((controller) => controller.getTask() === oldData);

      this._initialTasks[taskIndex] = newData;
      this._visibleCardControllers[cardControllerIndex].updateRender(this._initialTasks[taskIndex]);
    }
  }


  _onSortTypeChanged(sortKey) {
    const sortedTasks = this._getSortedTasks(sortKey);
    this._resetBoard();
    this._loadMoreCards(0, CARDS_STEP, sortedTasks);
    this._renderLoadButton();
  }

  _sortClickHandler(evt) {
    const oldSortType = this._sortComponent.getCurrentSortType();
    this._sortComponent.setCurrentSortType(evt);
    const isChanged = oldSortType !== this._sortComponent.getCurrentSortType();

    if (isChanged) {
      this._onSortTypeChanged(this._sortComponent.getCurrentSortType());
    }
  }

  _onViewChange(evt) {
    this._visibleCardControllers
      .forEach((controller) => controller.setDefaultView(evt));
  }

  render(tasks) {
    this._initialTasks = tasks;

    const isEmptyBoard = !this._initialTasks.length;

    render(this._container, this._boardComponent);

    if (isEmptyBoard) {
      render(this._boardComponent.getElement(), this._noTaskComponent);
    } else {
      render(this._boardComponent.getElement(), this._sortComponent);
      render(this._boardComponent.getElement(), this._cardsContainerComponent);
      this._renderLoadButton();


      const sortedTasks = this._getSortedTasks(this._sortComponent.getCurrentSortType());
      this._loadMoreCards(0, CARDS_STEP, sortedTasks);

      this._sortComponent.setClickHandler(this._sortClickHandler.bind(this));
    }
  }
}

export default BoardController;
