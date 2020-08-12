import { sampleSize, sortBy } from 'lodash';

import data from './movies';

const PROPERTY = 'worldwideGross';

const generateMovieGrossQuestion = () => {
  const selections =  sampleSize(data, 2);
  const sortedSelections = sortBy(selections, [PROPERTY]);
  const largerSelection = sortedSelections[1];
  const smallerSelection = sortedSelections[0];
  const answer = largerSelection[PROPERTY] / smallerSelection[PROPERTY];

  return `Worldwide Movie Gross | How many times more lucrative was ${largerSelection.name} (${largerSelection.year}) than ${smallerSelection.name} (${smallerSelection.year})? | ${answer.toFixed(1)} | Original release, not adjusted for inflation.`;

};

export default generateMovieGrossQuestion;
