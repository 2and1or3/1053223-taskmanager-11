import AbstractComponent from './abstract-component.js';

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
      ${title} <span class="filter__${key}-count">${count}</span></label>`
  );
};


const createFiltersTemplate = function (filters) {
  const filtersKeys = Object.keys(filters);

  const filtersMarkup =
    filtersKeys
      .map((key, i) => createFilterMarkup(filters[key], key, i === 0))
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
}

export default Filters;
