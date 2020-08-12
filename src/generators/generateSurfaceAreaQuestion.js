import { each, map, sortBy } from 'lodash';
import multiWeightedRandom from 'multi-weighted-random';

import rawData from 'country-json/src/country-by-surface-area';

const PROPERTY = 'area';

const data = [];
each(rawData, (c) => {
  if (c[PROPERTY]) {
    data.push({
      name: c.country,
      [PROPERTY]: parseInt(c[PROPERTY]),
    });
  }
});
const weights = map(data, (c) => Math.sqrt(parseInt(c[PROPERTY])));

const generatePopulationQuestion = () => {
  const indices = multiWeightedRandom(weights, 2);
  const selections = map(indices, (i) => data[i]);
  const sortedSelections = sortBy(selections, [PROPERTY]);
  const largerSelection = sortedSelections[1];
  const smallerSelection = sortedSelections[0];
  const answer = largerSelection[PROPERTY] / smallerSelection[PROPERTY];

  return `National Surface Area | How many times larger is ${largerSelection.name} then ${smallerSelection.name}? | ${answer.toFixed(1)}`;
};

export default generatePopulationQuestion;
