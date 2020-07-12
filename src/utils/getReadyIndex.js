import { PHASES_PER_ROUND } from './constants';

const getReadyIndex = (game) => {
  return game?.phase + game?.round * PHASES_PER_ROUND;
};

export default getReadyIndex;
