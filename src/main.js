import MenuComponent from './components/menu.js';
import StatisticComponent from './components/statistic.js';

import BoardController from './controllers/board-controller.js';
import FiltersController from './controllers/filters-controller.js';

import API from './api.js';
import TasksModel from './models/tasks.js';

import {render} from './utils/render.js';
import {MENU_IDS} from './const.js';

const TOKEN = `Basic eo0w590ik2988asd1f1a`;

const onScreenChange = (id) => {
  switch (id) {
    case MENU_IDS.TASKS:
      statisticComponent.hide();
      boardController.show();
      filtersController.resetFilterType();
      break;

    case MENU_IDS.STATISTIC:
      boardController.hide();
      statisticComponent.show();
      statisticComponent.update(tasksModel.getAllTasks());
      statisticComponent.renderCharts();
      filtersController.resetFilterType();
      break;
  }
};


const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.control`);


const menuComponent = new MenuComponent();

const api = new API(TOKEN);
const tasksModel = new TasksModel();
const filtersController = new FiltersController(main, tasksModel);
const statisticComponent = new StatisticComponent(tasksModel);
const boardController = new BoardController(main, tasksModel, api);

render(mainControl, menuComponent);
filtersController.render();

boardController.renderStateOnFirstLoad();


api.getTasks()
.then((tasks) => tasksModel.setTasks(tasks))
.then(() => {
  render(main, statisticComponent);
  statisticComponent.hide();

  boardController.render();

  menuComponent.setNewTaskHandler((evt) => {
    filtersController.resetFilterType();
    boardController.createCard(evt);
  });
})
.catch((err) => {
  throw new Error(err);
});

menuComponent.setChangeScreenHandler(onScreenChange);
