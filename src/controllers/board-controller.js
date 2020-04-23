import SortComponent from '../components/sort.js';
import LoadButtonComponent from '../components/load-button.js';
import BoardComponent from '../components/board.js';
import CardsContainerComponent from '../components/cards-container.js';
import NoTaskComponent from '../components/no-task.js';

import CardController from './card-controller.js';

import {render, removeComponent} from '../utils.js';

const CARDS_STEP = 8;


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
    const quantityOfTasks = tasks.length;
    const isEmptyBoard = !quantityOfTasks;


    render(this._container, this._boardComponent);

    if (isEmptyBoard) {
      render(this._boardComponent.getElement(), this._noTaskComponent);
    } else {

      render(this._boardComponent.getElement(), this._sortComponent);
      render(this._boardComponent.getElement(), this._cardsContainerComponent);


      let visibleCards = 0;
      let addCardStep = () => visibleCards + CARDS_STEP;

      const loadMore = (begin, end) => {
        tasks
          .slice(begin, end)
          .forEach((task) => {
            const cardController = new CardController(this._cardsContainerComponent.getElement());
            cardController.render(task);
          });

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
          removeComponent(this._loadButtonComponent);
        }
      };

      render(this._boardComponent.getElement(), this._loadButtonComponent);

      this._loadButtonComponent.setClickHandler(onLoadButtonClick);
    }
  }
}

export default BoardController;
