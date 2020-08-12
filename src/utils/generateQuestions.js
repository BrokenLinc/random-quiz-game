import { sample, times } from 'lodash';

import generatePlanetaryDistanceQuestion from '../generators/generatePlantaryDistanceQuestion';
import generatePlanetaryMassQuestion from '../generators/generatePlantaryMassQuestion';
import generatePopulationQuestion from '../generators/generatePopulationQuestion';
import generateSurfaceAreaQuestion from '../generators/generateSurfaceAreaQuestion';
import generateMovieBudgetQuestion from '../generators/generateMovieBudgetQuestion';
import generateMovieGrossQuestion from '../generators/generateMovieGrossQuestion';

const generators = [
  generatePlanetaryDistanceQuestion,
  generatePlanetaryMassQuestion,
  generatePopulationQuestion,
  generateSurfaceAreaQuestion,
  generateMovieBudgetQuestion,
  generateMovieGrossQuestion,
];

const generateQuestions = (count = 1) => {
  return times(count, () => {
    return sample(generators)();
  });
};

console.log(generateQuestions(10));

export default generateQuestions;
