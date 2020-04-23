import AbstractComponent from './abstract-component.js';

const createNoTaskTemplate = () => `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
  </p>`;


class NoTask extends AbstractComponent {
  getTemplate() {
    return createNoTaskTemplate();
  }
}

export default NoTask;
