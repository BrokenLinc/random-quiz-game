import { sampleSize, sortBy } from 'lodash';

import data from './movies';

const PROPERTY = 'budget';

const generateMovieBudgetQuestion = () => {
  const selections =  sampleSize(data, 2);
  const sortedSelections = sortBy(selections, [PROPERTY]);
  const largerSelection = sortedSelections[1];
  const smallerSelection = sortedSelections[0];
  const answer = largerSelection[PROPERTY] / smallerSelection[PROPERTY];

  return `Movie Budget | How many times more expensive was ${largerSelection.name} (${largerSelection.year}) than ${smallerSelection.name} (${smallerSelection.year})? | ${answer.toFixed(1)} | Not adjusted for inflation.`;

};

export default generateMovieBudgetQuestion;
