import {FILTER_TYPES} from '../const.js';
import {checkDate, isToday, isRepeating} from './common.js';

const FILTER_FUNCTIONS = {
  [FILTER_TYPES.ALL]: (tasks) => tasks.filter(() => true),
  [FILTER_TYPES.OVERDUE]: (tasks) => tasks.filter((task) => checkDate(task.dueDate)),
  [FILTER_TYPES.TODAY]: (tasks) => tasks.filter((task) => isToday(task.dueDate)),
  [FILTER_TYPES.FAVORITES]: (tasks) => tasks.filter((task) => task.isFavorite),
  [FILTER_TYPES.REPEATING]: (tasks) => tasks.filter((task) => isRepeating(task.repeatDays)),
  [FILTER_TYPES.ARCHIVE]: (tasks) => tasks.filter((task) => task.isArchive),
};


const getTasksByFilter = (tasks, filterType) => {
  const filteredTasks = FILTER_FUNCTIONS[filterType](tasks);

  return filteredTasks;
};


export {getTasksByFilter};
