import {FILTER_TYPES} from '../const.js';

import {getTasksByFilter} from '../utils/filter.js';

class Tasks {
  constructor() {
    this._tasks = [];
    this._currentFilter = FILTER_TYPES.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  addDataChangeHandler(cb) {
    this._dataChangeHandlers.push(cb);
  }

  addFilterChangeHandler(cb) {
    this._filterChangeHandlers.push(cb);
  }

  getTasks() {
    return getTasksByFilter(this._tasks, this._currentFilter);
  }

  getAllTasks() {
    return this._tasks;
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._callHandlers(this._dataChangeHandlers);
  }

  updateTask(newTask) {
    this._tasks[newTask.id] = newTask;

    this._callHandlers(this._dataChangeHandlers);
  }

  deleteTask(id) {
    const taskIndex = this._tasks.findIndex((task) => task.id === id);

    this._tasks.splice(taskIndex, 1);
    this._callHandlers(this._dataChangeHandlers);
  }

  addTask(newTask) {
    this._tasks.unshift(newTask);
  }

  setCurrentFilter(filterType) {
    this._currentFilter = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }
}

export default Tasks;
