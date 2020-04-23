import SortComponent from '../components/sort.js';
import LoadButtonComponent from '../components/load-button.js';
import BoardComponent from '../components/board.js';
import CardsContainerComponent from '../components/cards-container.js';
import NoTaskComponent from '../components/no-task.js';

import CardController from './card-controller.js';

import {render, removeComponent} from '../utils.js';

const CARDS_STEP = 8;
const SORT_TYPES = {
  DEFAULT: `default`,
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`,
};


class BoardController {
  constructor(container) {
    this._container = container;
    this._boardComponent = new BoardComponent();
    this._noTaskComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._cardsContainerComponent = new CardsContainerComponent();
    this._loadButtonComponent = new LoadButtonComponent();
  }

  render(tasks) {

    const SORTED_TASKS = {
      [SORT_TYPES.DEFAULT]: tasks,
      [SORT_TYPES.DATE_UP]: null,
      [SORT_TYPES.DATE_DOWN]: null,
    };

    const quantityOfTasks = SORTED_TASKS[SORT_TYPES.DEFAULT].length;
    const isEmptyBoard = !quantityOfTasks;
    let tasksToRender = SORTED_TASKS[SORT_TYPES.DEFAULT];
    let sortType = SORT_TYPES.DEFAULT;

    render(this._container, this._boardComponent);

    if (isEmptyBoard) {
      render(this._boardComponent.getElement(), this._noTaskComponent);
    } else {
      render(this._boardComponent.getElement(), this._sortComponent);
      render(this._boardComponent.getElement(), this._cardsContainerComponent);
      render(this._boardComponent.getElement(), this._loadButtonComponent);

      const getSortUpDateTasks = (initialTasks) => {
        const sortedUpDate = initialTasks.slice(0);

        sortedUpDate.sort((leftTask, rightTask) => leftTask.dueDate - rightTask.dueDate);

        return sortedUpDate;
      };
      const getSortDownDateTasks = (initialTasks) => {
        const sortedDownDate = initialTasks.slice(0);

        sortedDownDate.sort((leftTask, rightTask) => rightTask.dueDate - leftTask.dueDate);

        return sortedDownDate;
      };

      SORTED_TASKS[SORT_TYPES.DATE_UP] = getSortUpDateTasks(SORTED_TASKS[SORT_TYPES.DEFAULT]);
      SORTED_TASKS[SORT_TYPES.DATE_DOWN] = getSortDownDateTasks(SORTED_TASKS[SORT_TYPES.DEFAULT]);

      let visibleCards = 0;
      let addCardStep = () => visibleCards + CARDS_STEP;

      const loadMore = (begin, end, currentTasks) => {
        currentTasks
          .slice(begin, end)
          .forEach((task) => {
            const cardController = new CardController(this._cardsContainerComponent.getElement());
            cardController.render(task);
          });

        const diffrence = end - begin;
        visibleCards += diffrence;
      };

      loadMore(0, CARDS_STEP, tasksToRender);

      const onLoadButtonClick = (evt) => {
        evt.preventDefault();

        const isCardEnd = addCardStep() >= quantityOfTasks;

        const currentEnd = isCardEnd ? quantityOfTasks : addCardStep();

        loadMore(visibleCards, currentEnd, tasksToRender);

        if (isCardEnd) {
          removeComponent(this._loadButtonComponent);
        }
      };

      const repeatRenderBoard = (sortKey) => {
        tasksToRender = SORTED_TASKS[sortKey];
        this.clear();
        visibleCards = 0;
        loadMore(0, CARDS_STEP, tasksToRender);
        render(this._boardComponent.getElement(), this._loadButtonComponent);
        this._loadButtonComponent.setClickHandler(onLoadButtonClick);
      };

      const onSortClick = (evt) => {
        const isRepeat = sortType === evt.target.dataset.sortType;

        if (!isRepeat) {
          sortType = evt.target.dataset.sortType;
          repeatRenderBoard(sortType);
        }
      };


      this._sortComponent.setClickHandler(onSortClick);
      this._loadButtonComponent.setClickHandler(onLoadButtonClick);
    }
  }

  clear() {
    this._cardsContainerComponent.getElement().innerHTML = ``;
    removeComponent(this._loadButtonComponent);
  }
}

export default BoardController;
