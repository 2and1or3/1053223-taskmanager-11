import FiltersComponent from '../components/filters.js';

import {render, replace} from '../utils/render.js';
import {getTasksByFilter} from '../utils/filter.js';

import {FILTER_TYPES} from '../const.js';

const filters = {
  [FILTER_TYPES.ALL]: {
    title: `All`,
    count: null,
    checked: false,
  },
  [FILTER_TYPES.OVERDUE]: {
    title: `Overdue`,
    count: null,
    checked: false,
  },
  [FILTER_TYPES.TODAY]: {
    title: `Today`,
    count: null,
    checked: false,
  },
  [FILTER_TYPES.FAVORITES]: {
    title: `Favorites`,
    count: null,
    checked: false,
  },
  [FILTER_TYPES.REPEATING]: {
    title: `Repeating`,
    count: null,
    checked: false,
  },
  [FILTER_TYPES.ARCHIVE]: {
    title: `Archive`,
    count: null,
    checked: false,
  },
};


class FiltersController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._currentFilter = FILTER_TYPES.ALL;

    this._filtersComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tasksModel.addDataChangeHandler(this._onDataChange);
  }

  _updateFilters(tasks) {
    const filterTypes = Object.keys(filters);

    filterTypes.forEach((type) => {
      filters[type].count = getTasksByFilter(tasks, type).length;
      filters[type].checked = type === this._currentFilter;
    });
  }

  _onFilterChange(filterType) {
    this._currentFilter = filterType;
    this._tasksModel.setCurrentFilter(this._currentFilter);
  }

  _onDataChange() {
    this.render();
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getAllTasks();

    this._updateFilters(allTasks);

    if (!this._filtersComponent) {
      this._filtersComponent = new FiltersComponent(filters);
      this._filtersComponent.setFilterChangeHandler(this._onFilterChange);
      render(container, this._filtersComponent);
    } else {
      const oldComponent = this._filtersComponent;
      this._filtersComponent = new FiltersComponent(filters);
      this._filtersComponent.setFilterChangeHandler(this._onFilterChange);
      replace(this._filtersComponent, oldComponent);
    }
  }

  resetFilterType() {
    this._currentFilter = FILTER_TYPES.ALL;
    this._tasksModel.setCurrentFilter(this._currentFilter);
    this.render();
  }
}

export default FiltersController;
