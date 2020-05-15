import {FILTER_TYPES} from '../const.js';
import {checkDate, isToday, isRepeating} from './common.js';

const FILTER_FUNCTIONS = {
  [FILTER_TYPES.ALL]: (tasks) => tasks.filter((task) => !task.isArchive),
  [FILTER_TYPES.OVERDUE]: (tasks) => tasks.filter((task) => checkDate(task.dueDate) && !task.isArchive),
  [FILTER_TYPES.TODAY]: (tasks) => tasks.filter((task) => isToday(task.dueDate) && !task.isArchive),
  [FILTER_TYPES.FAVORITES]: (tasks) => tasks.filter((task) => task.isFavorite && !task.isArchive),
  [FILTER_TYPES.REPEATING]: (tasks) => tasks.filter((task) => isRepeating(task.repeatDays) && !task.isArchive),
  [FILTER_TYPES.ARCHIVE]: (tasks) => tasks.filter((task) => task.isArchive),
};


const getTasksByFilter = (tasks, filterType) => {
  const filteredTasks = FILTER_FUNCTIONS[filterType](tasks);

  return filteredTasks;
};


export {getTasksByFilter};
