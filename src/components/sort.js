import AbstractComponent from './abstract-component.js';

const SORT_TYPES = {
  DEFAULT: `default`,
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`,
};

const createSortTemplate = function () {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter" data-sort-type="${SORT_TYPES.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__filter" data-sort-type="${SORT_TYPES.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__filter" data-sort-type="${SORT_TYPES.DATE_DOWN}">SORT BY DATE down</a>
    </div>`
  );
};

class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SORT_TYPES.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getCurrentSortType() {
    return this._currentSortType;
  }

  setCurrentSortType(evt) {
    const isLink = evt.target.tagName === `A`;

    if (isLink) {
      this._currentSortType = evt.target.dataset.sortType;
    }
  }

  setClickHandler(cb) {
    this.getElement().addEventListener(`click`, cb);
  }
}

export default Sort;
export {SORT_TYPES};
