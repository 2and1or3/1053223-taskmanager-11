import TaskAdapter from './models/task-adapter.js';

const MAIN_URL = `https://11.ecmascript.pages.academy/task-manager/tasks`;

class API {
  constructor(token) {
    this._token = token;
  }

  getTasks() {
    const headers = new Headers();
    headers.append(`Authorization`, this._token);

    const options = {
      headers,
    };

    return fetch(MAIN_URL, options)
            .then((response) => response.json())
            .then((tasks) => TaskAdapter.parseTasks(tasks))
            .catch(() => []);
  }

  updateTask(newData) {
    const url = MAIN_URL + `/` + newData.id;
    const headers = new Headers();
    headers.append(`Authorization`, this._token);
    headers.append(`Content-Type`, `application/json`);

    newData = TaskAdapter.toRAW(newData);

    const options = {
      method: `PUT`,
      headers,
      body: JSON.stringify(newData),
    };

    return fetch(url, options)
            .then((response) => response.json())
            .then((task) => TaskAdapter.parseTask(task))
            .catch(() => []);
  }
}

export default API;
