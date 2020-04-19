import {createElement} from '../utils.js';

const createTaskContainer = () => `<div class="board__tasks"></div>`;

class TaskContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTaskContainer();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default TaskContainer;
