import AbstractComponent from './abstract-component.js';

import {parsePrefixId} from '../utils/common.js';

const MENU_PREFIX_ID = `control__`;

const createMenuTemplate = () => {
  return (
    `<section class="control__btn-wrap">
        <input
          type="radio"
          name="control"
          id="control__new-task"
          class="control__input visually-hidden"
        />
        <label for="control__new-task" class="control__label control__label--new-task"
          >+ ADD NEW TASK</label>
        <input
          type="radio"
          name="control"
          id="control__task"
          class="control__input visually-hidden"
          checked/>
        <label for="control__task" class="control__label">TASKS</label>
        <input
          type="radio"
          name="control"
          id="control__statistic"
          class="control__input visually-hidden"/>
        <label for="control__statistic" class="control__label"
          >STATISTICS</label>
      </section>`
  );
};

class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setChangeScreenHandler(cb) {
    const container = this.getElement();

    container.addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        const id = parsePrefixId(MENU_PREFIX_ID, evt.target.id);
        cb(id);
      }
    });
  }

  setNewTaskHandler(cb) {
    this.getElement().querySelector(`.control__label--new-task`).addEventListener(`click`, (evt) => {
      cb(evt);
    });
  }
}

export default Menu;
