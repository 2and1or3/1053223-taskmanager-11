import {COLORS} from '../const.js';

const DIFFERENCE_DAY = 7;
const CARD_COUNT = 19;

const DESCRIPTIONS = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * Math.round(Math.random() * DIFFERENCE_DAY);

  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const generateTask = () => {
  return {
    description: DESCRIPTIONS[Math.round(Math.random() * (DESCRIPTIONS.length - 1))],
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
    dueDate: Math.random() > 0.5 ? getRandomDate() : null,
    repeatDays: {
      mo: Math.random() > 0.5,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false,
    },
    isArchive: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };
};

const generateTasks = (count) => Array(count).fill(``).map(generateTask);

const tasksData = generateTasks(CARD_COUNT);

export {tasksData};
