import TaskAdapter from '../models/task-adapter.js';

const getSyncTasks = (syncData) => {
  const successTasks = syncData
  .filter((task) => task.success)
  .map((task) => task.payload.task);

  return successTasks;
};

class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
    this._isNeedSync = false;
  }

  _isOnline() {
    return window.navigator.onLine;
  }

  getTasks() {
    if (this._isOnline()) {
      return this._api.getTasks()
              .then((tasks) => {
                this._storage.setItems(tasks);

                return Promise.resolve(tasks);
              });
    }

    return Promise.resolve(this._storage.getItems());
  }

  updateTask(newData) {
    if (this._isOnline()) {
      return this._api.updateTask(newData)
              .then((updatedTask) => {
                this._storage.updateItem(updatedTask);

                return Promise.resolve(updatedTask);
              });
    }

    this._storage.updateItem(newData);
    this._isNeedSync = true;

    return Promise.resolve(newData);
  }

  deleteTask(id) {
    if (this._isOnline()) {
      return this._api.deleteTask(id)
              .then((isOk) => {
                if (isOk) {
                  this._storage.deleteItem(id);

                  return Promise.resolve(isOk);
                } else {
                  return Promise.rejected(`error`);
                }
              });
    }

    this._storage.deleteItem(id);
    this._isNeedSync = true;

    return Promise.resolve(true);
  }

  createTask(localTask) {
    if (this._isOnline()) {
      return this._api.createTask(localTask)
            .then((newTask) => {
              this._storage.createItem(newTask);

              return Promise.resolve(newTask);
            });
    }

    this._storage.createItem(localTask);
    this._isNeedSync = true;

    return Promise.resolve(localTask);
  }

  sync() {
    if (this._isNeedSync) {
      const tasks = this._storage.getItems();

      this._api.sync(tasks)
        .then((response) => {
          this._isNeedSync = false;
          const {updated, created} = response;

          const createdTasks = getSyncTasks(created);
          const updatedTasks = getSyncTasks(updated);

          const currentTasks = TaskAdapter.parseTasks([...updatedTasks, ...createdTasks]);

          this._storage.setItems(currentTasks);
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }
}

export default Provider;
