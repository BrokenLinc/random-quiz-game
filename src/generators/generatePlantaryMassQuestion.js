import { sampleSize, sortBy } from 'lodash';

import abbreviateNum from '../utils/abbreviateNumber';
import data from './planets';

const PROPERTY = 'mass';

const generatePlanetaryMassQuestion  = () => {
  const selections = sampleSize(data, 2);
  const sortedSelections = sortBy(selections, [PROPERTY]);
  const largerSelection = sortedSelections[1];
  const smallerSelection = sortedSelections[0];
  const answer = largerSelection[PROPERTY] / smallerSelection[PROPERTY];

  return {
    category: 'Planetary Mass',
    text: `How many times more massive is ${largerSelection.name} than ${smallerSelection.name}?`,
    answer: answer.toFixed(1),
    answerNote: `${largerSelection.name} measures ${abbreviateNum(largerSelection[PROPERTY] * 1000000000000000000000000000)} kg, while ${smallerSelection.name} measures ${abbreviateNum(smallerSelection[PROPERTY] * 1000000000000000000000000000)} kg.`,
  };
};

export default generatePlanetaryMassQuestion;
