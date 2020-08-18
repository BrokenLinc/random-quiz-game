import { sampleSize, sortBy } from 'lodash';

import data from './movies';

const PROPERTY = 'budget';

const generateMovieBudgetQuestion = () => {
  const selections =  sampleSize(data, 2);
  const sortedSelections = sortBy(selections, [PROPERTY]);
  const largerSelection = sortedSelections[1];
  const smallerSelection = sortedSelections[0];
  const answer = largerSelection[PROPERTY] / smallerSelection[PROPERTY];

  return {
    category: 'Movie Budget',
    text: `How many times more expensive was ${largerSelection.name} than ${smallerSelection.name}?`,
    note: 'Not adjusted for inflation.',
    answer: answer.toFixed(1),
  };
};

export default generateMovieBudgetQuestion;
