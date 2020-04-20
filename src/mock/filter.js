import {cards} from './task.js';
import {checkDate} from '../utils.js';
import {FILTER_TYPES} from '../const.js';

const updateFilters = () => {
  const filters = {
    [FILTER_TYPES.ALL]: cards.length,
    [FILTER_TYPES.OVERDUE]: 0,
    [FILTER_TYPES.TODAY]: 0,
    [FILTER_TYPES.FAVORITES]: 0,
    [FILTER_TYPES.REPEATING]: 0,
    [FILTER_TYPES.ARCHIVE]: 0,
  };

  const today = new Date();

  cards.forEach((it) => {
    if (checkDate(it.dueDate)) {
      filters[FILTER_TYPES.OVERDUE]++;
    }

    if (it.dueDate && it.dueDate.getDate() === today.getDate()) {
      filters[FILTER_TYPES.TODAY]++;
    }

    if (it.isFavorite) {
      filters[FILTER_TYPES.FAVORITES]++;
    }


    if (Object.values(it.repeatDays).some(Boolean)) {
      filters[FILTER_TYPES.REPEATING]++;
    }

    if (it.isArchive) {
      filters[FILTER_TYPES.ARCHIVE]++;
    }
  });

  return filters;
};

const generateFilters = () => {
  const filtersCount = updateFilters();
  const filters = [];

  for (const [key, value] of Object.entries(filtersCount)) {
    const filter = {
      title: key,
      count: value,
    };

    filters.push(filter);
  }

  return filters;
};

export {generateFilters, updateFilters};
