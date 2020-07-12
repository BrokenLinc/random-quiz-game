import { each, reduce, times } from 'lodash';

import { ROUNDS_PER_GAME } from '../utils/constants';

const getUserScores = (userId, users) => {
  return reduce(users, (scores, { votes }) => {
    each(votes, (vote, round) => {
      if (vote === userId) {
        scores[round] = (scores[round] || 0) + 1;
      }
    });
    return scores;
  }, times(ROUNDS_PER_GAME, () => 0));
};

export default getUserScores;
