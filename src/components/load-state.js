import AbstractComponent from './abstract-component.js';

const createLoadStateTemplate = () => `<p class="board__no-tasks">
  Loading...
</p>`;


class LoadState extends AbstractComponent {
  getTemplate() {
    return createLoadStateTemplate();
  }
}

export default LoadState;
