import {cards} from './task.js';
import {checkDate} from '../utils.js';

const checkCards = () => {
  const filters = {
    'all': cards.length,
    'overdue': 0,
    'today': 0,
    'favorites': 0,
    'repeating': 0,
    'archive': 0,
  };

  const today = new Date();

  cards.forEach((it) => {

    checkDate(it.dueDate) ? filters[`overdue`]++ : ``;

    if (it.dueDate) {
      it.dueDate.getDate() === today.getDate() ? filters[`today`]++ : ``;
    }

    it.isFavorite ? filters[`favorites`]++ : ``;

    Object.values(it.repeatDays).some(Boolean) ? filters[`repeating`]++ : ``;

    it.isArchive ? filters[`archive`]++ : ``;
  });

  return filters;
};

const generateFilters = () => {
  const filtersCount = checkCards();
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

export {generateFilters};
