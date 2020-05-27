import TaskAdapter from '../models/task-adapter.js';
import {nanoid} from 'nanoid';


class Store {
  constructor(keyStorage, storage) {
    this._keyStorage = keyStorage;
    this._storage = storage;
  }

  setItems(items) {
    const rawItems = items.map((item) => TaskAdapter.toRAW(item));
    const localString = JSON.stringify(rawItems);

    this._storage.setItem(this._keyStorage, localString);
  }

  getItems() {
    const localString = this._storage.getItem(this._keyStorage);
    const rawItems = JSON.parse(localString);

    return TaskAdapter.parseTasks(rawItems);
  }

  updateItem(newItem) {
    const id = newItem.id;
    const tasks = this.getItems();
    const targetIndex = tasks.findIndex((task) => task.id === id);

    tasks[targetIndex] = newItem;

    this.setItems(tasks);
  }

  deleteItem(id) {
    const tasks = this.getItems();
    const targetIndex = tasks.findIndex((task) => task.id === id);

    tasks.splice(targetIndex, 1);

    this.setItems(tasks);
  }

  createItem(newTask) {
    const currentId = newTask.id ? newTask.id : nanoid();
    const tasks = this.getItems();

    const localTask = Object.assign(newTask, {id: currentId});
    tasks.push(localTask);

    this.setItems(tasks);
  }
}

export default Store;
