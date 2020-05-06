import AbstractComponent from './abstract-component.js';

import {parsePrefixId} from '../utils/common.js';

const FILTER_ID_PREFIX = `filter__`;
// const getFilterId = (id) => id.slice(FILTER_ID_PREFIX.length);

const createFilterMarkup = function (filter, key, isChecked) {
  const {title, count} = filter;
  const check = isChecked ? `checked` : ``;

  return (
    `<input
      type="radio"
      id="filter__${key}"
      class="filter__input visually-hidden"
      name="filter"
      ${check}/>
    <label for="filter__${key}" class="filter__label">
      ${title} <span class="filter__${key}-count">${+count}</span></label>`
  );
};


const createFiltersTemplate = function (filters) {
  const filtersKeys = Object.keys(filters);

  const filtersMarkup =
    filtersKeys
      .map((key) => createFilterMarkup(filters[key], key, filters[key].checked))
      .join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

class Filters extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(onFilterChange) {
    const container = this.getElement();

    container.addEventListener(`change`, (evt) => {
      const currentFilter = parsePrefixId(FILTER_ID_PREFIX, evt.target.id);
      onFilterChange(currentFilter);
    });
  }
}

export default Filters;
