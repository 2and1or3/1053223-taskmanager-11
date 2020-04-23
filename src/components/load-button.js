import AbstractComponent from './abstract-component.js';

const createLoadButtonTemplate = () => `<button class="load-more" type="button">load more</button>`;

class LoadButton extends AbstractComponent {
  getTemplate() {
    return createLoadButtonTemplate();
  }

  setClickHandler(cb) {
    this.getElement().addEventListener(`click`, cb);
  }
}

export default LoadButton;
