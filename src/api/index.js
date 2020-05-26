import TaskAdapter from '../models/task-adapter.js';

const MAIN_URL = `https://11.ecmascript.pages.academy/task-manager/tasks`;
const METHODS = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const SYNC_URL = `sync`;

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(response.status);
  }
};

class API {
  constructor(token) {
    this._token = token;
  }

  _getRequest(headers, body, method = METHODS.GET, url = ``) {
    headers.append(`Authorization`, this._token);

    const options = {
      headers,
      method,
      body,
    };

    const resultUrl = url ? MAIN_URL + `/` + url : MAIN_URL;

    return fetch(resultUrl, options)
            .then(checkStatus);
  }

  getTasks() {
    const headers = new Headers();

    return this._getRequest(headers)
            .then((response) => response.json())
            .then((tasks) => TaskAdapter.parseTasks(tasks))
            .catch((err) => {
              throw new Error(err);
            });
  }

  updateTask(newData) {
    const headers = new Headers();
    headers.append(`Content-Type`, `application/json`);

    newData = TaskAdapter.toRAW(newData);
    const body = JSON.stringify(newData);

    return this._getRequest(headers, body, METHODS.PUT, newData.id)
            .then((response) => response.json())
            .then((task) => TaskAdapter.parseTask(task))
            .catch((err) => {
              throw new Error(err);
            });
  }

  createTask(localTask) {
    const headers = new Headers();
    headers.append(`Content-Type`, `application/json`);

    localTask = TaskAdapter.toRAW(localTask);

    const body = JSON.stringify(localTask);

    return this._getRequest(headers, body, METHODS.POST)
                .then((response) => response.json())
                .then((task) => TaskAdapter.parseTask(task))
                .catch((err) => {
                  throw new Error(err);
                });
  }

  deleteTask(id) {
    const headers = new Headers();

    return this._getRequest(headers, null, METHODS.DELETE, id)
            .then((response) => response.ok);
  }

  sync(freshTasks) {
    const headers = new Headers();
    headers.append(`Content-Type`, `application/json`);

    freshTasks = freshTasks.map((freshTask) => TaskAdapter.toRAW(freshTask));

    const body = JSON.stringify(freshTasks);

    return this._getRequest(headers, body, METHODS.POST, SYNC_URL)
            .then((response) => response.json());
  }
}

export default API;
