import { reduce, sumBy } from 'lodash';

import { ROUNDS_PER_GAME } from '../utils/constants';

const getGameRound = (users) => {
  return reduce(users,(round, user) => {
    return Math.min(round, sumBy(user.readies, (ready) => {
      return ready ? 1 : 0;
    }));
  }, ROUNDS_PER_GAME - 1);
};

export default getGameRound;
