import { sampleSize, sortBy } from 'lodash';

import abbreviateNum from '../utils/abbreviateNumber';
import data from './planets';

const PROPERTY = 'distanceFromSun';

const generatePlanetaryDistanceQuestion  = () => {
  const selections =  sampleSize(data, 2)
  const sortedSelections = sortBy(selections, [PROPERTY]);
  const largerSelection = sortedSelections[1];
  const smallerSelection = sortedSelections[0];
  const answer = largerSelection[PROPERTY] / smallerSelection[PROPERTY];

  return {
    category: 'Planetary Distance from the Sun',
    text: `How many times further is ${largerSelection.name} than ${smallerSelection.name}?`,
    answer: answer.toFixed(1),
    answerNote: `${largerSelection.name} is ${abbreviateNum(largerSelection[PROPERTY] * 1000000)} kilometers from the Sun, while ${smallerSelection.name} is ${abbreviateNum(smallerSelection[PROPERTY] * 1000000)} kilometers away.`,
  };
};

export default generatePlanetaryDistanceQuestion;
