import SortComponent, {SORT_TYPES} from '../components/sort.js';
import LoadButtonComponent from '../components/load-button.js';
import BoardComponent from '../components/board.js';
import CardsContainerComponent from '../components/cards-container.js';
import NoTaskComponent from '../components/no-task.js';

import CardController from './card-controller.js';

import {render, removeComponent} from '../utils/render.js';

const CARDS_STEP = 8;

const DEFAULT_COLOR = `black`;

const SORT_FUNCTIONS = {
  [SORT_TYPES.DATE_UP]: (leftTask, rightTask) => leftTask.dueDate - rightTask.dueDate,
  [SORT_TYPES.DATE_DOWN]: (leftTask, rightTask) => rightTask.dueDate - leftTask.dueDate,
};


class BoardController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._visibleCards = 0;
    this._visibleCardControllers = [];

    this._boardComponent = new BoardComponent();
    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._cardsContainerComponent = new CardsContainerComponent();
    this._loadButtonComponent = new LoadButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onDataDelete = this._onDataDelete.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._loadButtonHandler = this._loadButtonHandler.bind(this);
    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._rerenderBoard = this._rerenderBoard.bind(this);

    this.createCard = this.createCard.bind(this);

    this._sortComponent.setClickHandler(this._sortClickHandler);
    this._tasksModel.addFilterChangeHandler(this._onFilterChange);
    this._tasksModel.addDataChangeHandler(this._rerenderBoard);
  }

  _getSortedTasks(sortFuncKey) {
    const sorted = this._tasksModel
                    .getTasks()
                    .slice(0);

    sorted.sort(SORT_FUNCTIONS[sortFuncKey]);

    return sorted;
  }

  _loadMoreCards(begin, end, currentTasks) {
    const diffrence = end - begin;
    this._visibleCards += diffrence;

    const newCardControllers =
      currentTasks
        .slice(begin, end)
        .map((task) => {
          const cardController =
          new CardController(
              this._cardsContainerComponent.getElement(),
              this._onDataChange,
              this._onViewChange,
              this._onDataDelete);

          cardController.render(task);

          return cardController;
        });

    this._visibleCardControllers = this._visibleCardControllers.concat(newCardControllers);
  }

  _loadButtonHandler(evt) {
    evt.preventDefault();
    const addCardStep = () => this._visibleCards + CARDS_STEP;
    const tasks = this._tasksModel.getTasks();

    const isCardEnd = addCardStep() >= tasks.length;
    const currentEnd = isCardEnd ? tasks.length : addCardStep();

    const sortedTasks = this._getSortedTasks(this._sortComponent.getCurrentSortType());

    this._loadMoreCards(this._visibleCards, currentEnd, sortedTasks);

    if (isCardEnd) {
      removeComponent(this._loadButtonComponent);
    }
  }

  _resetBoard() {
    this._visibleCards = 0;
    this._visibleCardControllers.forEach((controller) => controller.destroy());
    this._visibleCardControllers = [];
    removeComponent(this._loadButtonComponent);
  }

  _rerenderBoard() {
    const filteredTasks = this._tasksModel.getTasks();
    const quantityToLoad = this._visibleCards;
    this._resetBoard();
    this._loadMoreCards(0, quantityToLoad, filteredTasks);

    this._renderLoadButton();
  }

  _renderLoadButton() {
    const tasks = this._tasksModel.getTasks();
    const isMoreThanStep = tasks.length > CARDS_STEP;
    const isMoreThanVisible = tasks.length > this._visibleCards;

    if (isMoreThanStep && isMoreThanVisible) {
      render(this._boardComponent.getElement(), this._loadButtonComponent);
      this._loadButtonComponent.setClickHandler(this._loadButtonHandler);
    }
  }

  _onDataDelete(id) {
    this._tasksModel.deleteTask(id);
  }

  _onDataChange(newData) {
    this._tasksModel.updateTask(newData);

    const controllerIndex = this._visibleCardControllers
                              .findIndex((controller) => controller.getId() === newData.id);

    this._visibleCardControllers[controllerIndex].updateRender(newData);
  }

  _onSortTypeChanged(sortKey) {
    const sortedTasks = this._getSortedTasks(sortKey);
    this._resetBoard();
    this._loadMoreCards(0, CARDS_STEP, sortedTasks);
    this._renderLoadButton();
  }

  _onFilterChange() {
    const filteredTasks = this._tasksModel.getTasks();
    const isMoreThanStep = filteredTasks.length > CARDS_STEP;
    const quantityToLoad = isMoreThanStep ? CARDS_STEP : filteredTasks.length;

    this._resetBoard();
    this._loadMoreCards(0, quantityToLoad, filteredTasks);

    this._renderLoadButton();
  }

  _onViewChange(evt) {
    this._visibleCardControllers
      .forEach((controller) => controller.setDefaultView(evt));
  }

  _sortClickHandler(evt) {
    const oldSortType = this._sortComponent.getCurrentSortType();
    this._sortComponent.setCurrentSortType(evt);
    const isChanged = oldSortType !== this._sortComponent.getCurrentSortType();

    if (isChanged) {
      this._onSortTypeChanged(this._sortComponent.getCurrentSortType());
    }
  }

  _makeEmptyTask() {
    const newTask = {
      description: ``,
      color: DEFAULT_COLOR,
      dueDate: null,
      repeatDays: {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false,
      },
      isArchive: false,
      isFavorite: false,
      id: this._tasksModel.getAllTasks().length,
    };

    return newTask;
  }

  render() {
    const tasks = this._tasksModel.getTasks();
    const isEmptyBoard = !tasks.length;

    render(this._container, this._boardComponent);

    if (isEmptyBoard) {
      render(this._boardComponent.getElement(), this._noTaskComponent);
    } else {
      render(this._boardComponent.getElement(), this._sortComponent);
      render(this._boardComponent.getElement(), this._cardsContainerComponent);
      this._renderLoadButton();


      const sortedTasks = this._getSortedTasks(this._sortComponent.getCurrentSortType());
      this._loadMoreCards(0, CARDS_STEP, sortedTasks);
    }
  }

  createCard(evt) {
    const emptyTask = this._makeEmptyTask();
    this._resetBoard();

    const cardController =
    new CardController(
        this._cardsContainerComponent.getElement(),
        this._onDataChange,
        this._onViewChange,
        this._onDataDelete);

    cardController.render(emptyTask);
    cardController.onCreatingCard(evt);

    this._visibleCardControllers = this._visibleCardControllers.concat(cardController);

    const allTasks = this._tasksModel.getAllTasks();

    this._loadMoreCards(1, CARDS_STEP, allTasks);
    this._renderLoadButton();
    this._tasksModel.addTask(emptyTask);
  }
}

export default BoardController;
