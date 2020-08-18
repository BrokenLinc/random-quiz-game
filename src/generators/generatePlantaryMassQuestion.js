import { sampleSize, sortBy } from 'lodash';

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
  };
};

export default generatePlanetaryMassQuestion;
