import MenuComponent from './components/menu.js';
import StatisticComponent from './components/statistic.js';

import BoardController from './controllers/board-controller.js';
import FiltersController from './controllers/filters-controller.js';

import TasksModel from './models/tasks.js';

import {render} from './utils/render.js';
import {tasksData} from './mock/task.js';
import {MENU_IDS} from './const.js';

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
render(mainControl, menuComponent);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasksData);

const filtersController = new FiltersController(main, tasksModel);
filtersController.render();


const statisticComponent = new StatisticComponent(tasksModel.getAllTasks());
render(main, statisticComponent);
statisticComponent.hide();


const boardController = new BoardController(main, tasksModel);
boardController.render();


menuComponent.setNewTaskHandler((evt) => {
  filtersController.resetFilterType();
  boardController.createCard(evt);
});

menuComponent.setChangeScreenHandler(onScreenChange);
