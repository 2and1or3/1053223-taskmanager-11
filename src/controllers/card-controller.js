import CardEditorComponent from '../components/card-editor.js';
import CardComponent from '../components/card.js';

import {render, replace} from '../utils.js';

const PRESS_KEY = {
  ESC: 27,
};


class CardController {
  constructor(container) {
    this._container = container;
    this._cardComponent = null;
    this._cardEditorComponent = null;
  }

  render(task) {
    this._cardComponent = new CardComponent(task);
    render(this._container, this._cardComponent);

    this._cardEditorComponent = new CardEditorComponent(task);

    const onEscPress = (evt) => {
      evt.preventDefault();
      if (evt.keyCode === PRESS_KEY.ESC) {
        closeEditor(evt);
      }
    };
    const openEditor = (evt) => {
      evt.preventDefault();
      replace(this._cardEditorComponent, this._cardComponent);
      document.addEventListener(`keydown`, onEscPress);
    };
    const closeEditor = (evt) => {
      evt.preventDefault();
      replace(this._cardComponent, this._cardEditorComponent);
      document.removeEventListener(`keydown`, onEscPress);
    };

    const onEditClick = (evt) => openEditor(evt);
    const onFormSubmit = (evt) => closeEditor(evt);

    this._cardComponent.setClickHandler(onEditClick);
    this._cardEditorComponent.setSubmitHandler(onFormSubmit);
  }
}

export default CardController;
