import MenuComponent from './components/menu.js';
import FiltersComponent from './components/filters.js';

import BoardController from './controllers/board-controller.js';

import {render, checkDate} from './utils.js';
import {FILTER_TYPES} from './const.js';
import {tasksData} from './mock/task.js';

const filters = {
  [FILTER_TYPES.ALL]: {
    title: `All`,
    count: null,
  },
  [FILTER_TYPES.OVERDUE]: {
    title: `Overdue`,
    count: null,
  },
  [FILTER_TYPES.TODAY]: {
    title: `Today`,
    count: null,
  },
  [FILTER_TYPES.FAVORITES]: {
    title: `Favorites`,
    count: null,
  },
  [FILTER_TYPES.REPEATING]: {
    title: `Repeating`,
    count: null,
  },
  [FILTER_TYPES.ARCHIVE]: {
    title: `Archive`,
    count: null,
  },
};

const updateFilters = (tasks) => {

  filters[FILTER_TYPES.ALL].count = tasks.length;

  const today = new Date();
  tasks.forEach((task) => {
    if (checkDate(task.dueDate)) {
      filters[FILTER_TYPES.OVERDUE].count++;
    }

    if (task.dueDate && task.dueDate.getDate() === today.getDate()) {
      filters[FILTER_TYPES.TODAY].count++;
    }

    if (task.isFavorite) {
      filters[FILTER_TYPES.FAVORITES].count++;
    }


    if (Object.values(task.repeatDays).some(Boolean)) {
      filters[FILTER_TYPES.REPEATING].count++;
    }

    if (task.isArchive) {
      filters[FILTER_TYPES.ARCHIVE].count++;
    }
  });
};

updateFilters(tasksData);


const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.control`);

render(mainControl, new MenuComponent());
render(main, new FiltersComponent(filters));


const boardController = new BoardController(main);
boardController.render(tasksData);
